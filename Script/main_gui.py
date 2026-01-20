"""
HomesPh Global News Engine - Combined Dashboard (Scraper + Reader)
Professional news management interface with CNN design aesthetics.
"""

import tkinter as tk
from tkinter import ttk, messagebox
from scraper import NewsScraper
from ai_service import AIProcessor
from storage import StorageHandler
from config import COUNTRIES, CATEGORIES
import threading
import uuid
import time
import redis
import json
import os
import webbrowser
from PIL import Image, ImageTk
import requests
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

class HomesPhDashboard:
    def __init__(self, root):
        self.root = root
        self.root.title("HomesPh | Global News Engine")
        self.root.geometry("1400x900")
        self.root.configure(bg="#ffffff")
        self.root.minsize(1200, 800)

        # CNN Colors (Light Theme)
        self.CNN_RED = "#cc0000"
        self.CNN_DARK_RED = "#990000"
        self.CNN_BLACK = "#000000"
        self.CNN_WHITE = "#ffffff"
        self.CNN_GRAY = "#f4f4f4"
        self.CNN_LIGHT_GRAY = "#e5e5e5"
        self.CNN_TEXT = "#333333"
        self.CNN_MUTED = "#666666"

        # Fonts (Helvetica)
        self.font_brand = ("Helvetica", 22, "bold")
        self.font_heading = ("Helvetica", 14, "bold")
        self.font_headline = ("Helvetica", 20, "bold")
        self.font_body = ("Helvetica", 11)
        self.font_small = ("Helvetica", 9)
        self.font_category = ("Helvetica", 10, "bold")

        # Initialize Services
        self.scraper = NewsScraper()
        self.ai = AIProcessor()
        self.storage = StorageHandler()
        
        # Redis Setup for Reader
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.prefix = os.getenv("REDIS_PREFIX", "homesph:")
        
        self.articles = []
        self.current_image = None
        self.full_url = ""
        
        self.setup_styles()
        self.setup_ui()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        
        # Treeview Style (Light)
        style.configure(
            "CNN.Treeview",
            background=self.CNN_WHITE,
            foreground=self.CNN_BLACK,
            fieldbackground=self.CNN_WHITE,
            rowheight=38,
            font=self.font_body
        )
        style.configure(
            "CNN.Treeview.Heading",
            background=self.CNN_GRAY,
            foreground=self.CNN_BLACK,
            font=self.font_category
        )
        style.map("CNN.Treeview", background=[("selected", self.CNN_RED)], foreground=[("selected", self.CNN_WHITE)])
        
        # Tab Style
        style.configure("TNotebook", background=self.CNN_GRAY)
        style.configure("TNotebook.Tab", font=self.font_category, padding=[20, 10])
        style.map("TNotebook.Tab", background=[("selected", self.CNN_RED)], foreground=[("selected", self.CNN_WHITE)])

    def setup_ui(self):
        # === TOP NAVIGATION BAR (Black) ===
        nav_bar = tk.Frame(self.root, bg=self.CNN_BLACK, height=50)
        nav_bar.pack(fill="x")
        nav_bar.pack_propagate(False)

        # Logo (Red Box)
        logo_frame = tk.Frame(nav_bar, bg=self.CNN_RED, padx=20, pady=10)
        logo_frame.pack(side="left")
        tk.Label(
            logo_frame, 
            text="HOMESPH", 
            fg=self.CNN_WHITE, 
            bg=self.CNN_RED, 
            font=self.font_brand
        ).pack()

        # Right side - Status
        self.status_label = tk.Label(
            nav_bar, 
            text="● LIVE", 
            fg=self.CNN_RED, 
            bg=self.CNN_BLACK, 
            font=("Helvetica", 11, "bold")
        )
        self.status_label.pack(side="right", padx=20)

        # === BREAKING NEWS TICKER (Red) ===
        ticker_bar = tk.Frame(self.root, bg=self.CNN_RED, height=35)
        ticker_bar.pack(fill="x")
        ticker_bar.pack_propagate(False)
        
        tk.Label(
            ticker_bar, 
            text="⚡ BREAKING", 
            fg=self.CNN_WHITE, 
            bg=self.CNN_DARK_RED,
            font=("Helvetica", 10, "bold"),
            padx=15
        ).pack(side="left", fill="y")
        
        self.ticker_text = tk.Label(
            ticker_bar, 
            text="Welcome to HomesPh Global News Engine — AI-Powered Real Estate Intelligence", 
            fg=self.CNN_WHITE, 
            bg=self.CNN_RED,
            font=("Helvetica", 10)
        )
        self.ticker_text.pack(side="left", padx=15)

        # === TABBED NOTEBOOK ===
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)

        # Tab 1: Scraper
        self.scraper_tab = tk.Frame(self.notebook, bg=self.CNN_WHITE)
        self.notebook.add(self.scraper_tab, text="  🔍 SCRAPER  ")
        self.setup_scraper_tab()

        # Tab 2: Reader
        self.reader_tab = tk.Frame(self.notebook, bg=self.CNN_WHITE)
        self.notebook.add(self.reader_tab, text="  📰 READER  ")
        self.setup_reader_tab()

        # === FOOTER (Light Gray) ===
        footer = tk.Frame(self.root, bg=self.CNN_GRAY, height=40)
        footer.pack(fill="x")
        footer.pack_propagate(False)
        
        tk.Label(
            footer, 
            text="© 2026 HomesPh Global News Engine — Powered by Gemini AI", 
            fg=self.CNN_MUTED, 
            bg=self.CNN_GRAY,
            font=self.font_small
        ).pack(pady=12)

    # ═══════════════════════════════════════════════════════════════
    # TAB 1: SCRAPER
    # ═══════════════════════════════════════════════════════════════
    
    def setup_scraper_tab(self):
        # === CONTROL PANEL ===
        control_panel = tk.Frame(self.scraper_tab, bg=self.CNN_GRAY, pady=15, padx=25)
        control_panel.pack(fill="x")

        # Left Controls
        left_controls = tk.Frame(control_panel, bg=self.CNN_GRAY)
        left_controls.pack(side="left")

        # Region Filter
        tk.Label(
            left_controls, text="REGION", 
            fg=self.CNN_MUTED, bg=self.CNN_GRAY, 
            font=self.font_small
        ).pack(side="left", padx=(0, 8))
        
        self.country_var = tk.StringVar(value="All Regions")
        country_options = ["All Regions"] + list(COUNTRIES.keys())
        self.country_menu = ttk.Combobox(
            left_controls, 
            textvariable=self.country_var, 
            values=country_options, 
            width=18,
            font=self.font_body
        )
        self.country_menu.pack(side="left", padx=5)

        # Category Filter
        tk.Label(
            left_controls, text="CATEGORY", 
            fg=self.CNN_MUTED, bg=self.CNN_GRAY, 
            font=self.font_small
        ).pack(side="left", padx=(25, 8))
        
        self.category_var = tk.StringVar(value="All Categories")
        category_options = ["All Categories"] + CATEGORIES
        self.category_menu = ttk.Combobox(
            left_controls, 
            textvariable=self.category_var, 
            values=category_options, 
            width=15,
            font=self.font_body
        )
        self.category_menu.pack(side="left", padx=5)

        # Buttons (Right)
        btn_frame = tk.Frame(control_panel, bg=self.CNN_GRAY)
        btn_frame.pack(side="right")

        self.btn_scrape = tk.Button(
            btn_frame, 
            text="🔍 SCRAPE NEWS", 
            command=self.start_scraping,
            bg=self.CNN_RED, 
            fg=self.CNN_WHITE, 
            font=self.font_category,
            relief="flat",
            padx=25, 
            pady=10,
            cursor="hand2",
            activebackground=self.CNN_DARK_RED,
            activeforeground=self.CNN_WHITE
        )
        self.btn_scrape.pack(side="left", padx=8)

        self.btn_process = tk.Button(
            btn_frame, 
            text="🤖 PROCESS SELECTED", 
            command=self.start_processing,
            bg=self.CNN_BLACK, 
            fg=self.CNN_WHITE, 
            font=self.font_category,
            relief="flat",
            padx=25, 
            pady=10,
            cursor="hand2",
            activebackground="#333333",
            activeforeground=self.CNN_WHITE
        )
        self.btn_process.pack(side="left", padx=8)

        # === MAIN CONTENT AREA ===
        content_area = tk.Frame(self.scraper_tab, bg=self.CNN_WHITE, padx=25, pady=15)
        content_area.pack(fill="both", expand=True)

        # Table Header
        header_frame = tk.Frame(content_area, bg=self.CNN_WHITE)
        header_frame.pack(fill="x", pady=(0, 12))
        
        tk.Label(
            header_frame, 
            text="📰 Latest Headlines", 
            fg=self.CNN_BLACK, 
            bg=self.CNN_WHITE,
            font=self.font_heading
        ).pack(side="left")
        
        self.count_label = tk.Label(
            header_frame, 
            text="0 articles", 
            fg=self.CNN_MUTED, 
            bg=self.CNN_WHITE,
            font=self.font_small
        )
        self.count_label.pack(side="right")

        # Table Container
        table_container = tk.Frame(content_area, bg=self.CNN_LIGHT_GRAY, padx=1, pady=1)
        table_container.pack(fill="both", expand=True)
        
        table_frame = tk.Frame(table_container, bg=self.CNN_WHITE)
        table_frame.pack(fill="both", expand=True)

        columns = ("country", "category", "title", "source", "status")
        self.tree = ttk.Treeview(
            table_frame, 
            columns=columns, 
            show="headings", 
            style="CNN.Treeview"
        )
        
        self.tree.heading("country", text="REGION")
        self.tree.heading("category", text="CATEGORY")
        self.tree.heading("title", text="HEADLINE")
        self.tree.heading("source", text="SOURCE")
        self.tree.heading("status", text="STATUS")
        
        self.tree.column("country", width=110, anchor="center")
        self.tree.column("category", width=100, anchor="center")
        self.tree.column("title", width=550)
        self.tree.column("source", width=140, anchor="center")
        self.tree.column("status", width=100, anchor="center")
        
        self.tree.pack(fill="both", expand=True, side="left")
        
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

    # ═══════════════════════════════════════════════════════════════
    # TAB 2: READER
    # ═══════════════════════════════════════════════════════════════
    
    def setup_reader_tab(self):
        # Main Pane
        main_pane = tk.PanedWindow(
            self.reader_tab, orient="horizontal", 
            bg=self.CNN_LIGHT_GRAY, sashwidth=4, sashrelief="flat"
        )
        main_pane.pack(fill="both", expand=True)

        # === LEFT PANEL: ARTICLE LIST ===
        left_panel = tk.Frame(main_pane, bg=self.CNN_WHITE, width=320)
        main_pane.add(left_panel, minsize=280)

        # Filter Header
        filter_header = tk.Frame(left_panel, bg=self.CNN_GRAY, pady=15, padx=15)
        filter_header.pack(fill="x")
        
        tk.Label(
            filter_header, text="SAVED ARTICLES", 
            fg=self.CNN_BLACK, bg=self.CNN_GRAY,
            font=self.font_category
        ).pack(side="left")

        btn_refresh = tk.Button(
            filter_header, text="↻ Refresh", 
            command=self.refresh_reader_list,
            bg=self.CNN_RED, fg=self.CNN_WHITE,
            font=("Helvetica", 9, "bold"),
            relief="flat",
            padx=10,
            cursor="hand2"
        )
        btn_refresh.pack(side="right")

        # Country Filter
        filter_row = tk.Frame(left_panel, bg=self.CNN_WHITE, padx=15, pady=10)
        filter_row.pack(fill="x")
        
        tk.Label(
            filter_row, text="Filter by Region:", 
            fg=self.CNN_MUTED, bg=self.CNN_WHITE,
            font=self.font_small
        ).pack(anchor="w")
        
        self.reader_country_var = tk.StringVar(value="All Regions")
        reader_country_options = ["All Regions"] + list(COUNTRIES.keys())
        self.reader_country_menu = ttk.Combobox(
            filter_row, 
            textvariable=self.reader_country_var, 
            values=reader_country_options, 
            width=30,
            font=self.font_body
        )
        self.reader_country_menu.pack(fill="x", pady=5)
        self.reader_country_menu.bind("<<ComboboxSelected>>", lambda e: self.refresh_reader_list())

        # Separator
        tk.Frame(left_panel, bg=self.CNN_LIGHT_GRAY, height=1).pack(fill="x")

        # Article List
        list_frame = tk.Frame(left_panel, bg=self.CNN_WHITE, padx=10, pady=10)
        list_frame.pack(fill="both", expand=True)
        
        self.reader_listbox = tk.Listbox(
            list_frame, 
            font=("Helvetica", 10), 
            bg=self.CNN_WHITE, 
            fg=self.CNN_TEXT,
            selectbackground=self.CNN_RED,
            selectforeground=self.CNN_WHITE,
            activestyle="none",
            relief="flat",
            highlightthickness=0,
            bd=0
        )
        self.reader_listbox.pack(fill="both", expand=True, side="left")
        self.reader_listbox.bind("<<ListboxSelect>>", self.on_reader_select)

        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.reader_listbox.yview)
        self.reader_listbox.configure(yscroll=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        # === RIGHT PANEL: ARTICLE CONTENT ===
        right_panel = tk.Frame(main_pane, bg=self.CNN_WHITE)
        main_pane.add(right_panel, minsize=600)

        # Scrollable Content
        canvas = tk.Canvas(right_panel, bg=self.CNN_WHITE, highlightthickness=0)
        scrollbar_right = ttk.Scrollbar(right_panel, orient="vertical", command=canvas.yview)
        self.reader_content_frame = tk.Frame(canvas, bg=self.CNN_WHITE)

        self.reader_content_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=self.reader_content_frame, anchor="nw", width=720)
        canvas.configure(yscrollcommand=scrollbar_right.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar_right.pack(side="right", fill="y")

        # Article Content Elements
        content_inner = tk.Frame(self.reader_content_frame, bg=self.CNN_WHITE, padx=35, pady=25)
        content_inner.pack(fill="both", expand=True)

        # Category Badge
        self.reader_category_label = tk.Label(
            content_inner, text="NEWS", 
            fg=self.CNN_WHITE, bg=self.CNN_RED,
            font=self.font_category,
            padx=12, pady=5
        )
        self.reader_category_label.pack(anchor="w", pady=(0, 18))

        # Headline
        self.reader_title_var = tk.StringVar(value="Select an article to read")
        self.reader_title_label = tk.Label(
            content_inner, 
            textvariable=self.reader_title_var, 
            font=self.font_headline, 
            bg=self.CNN_WHITE, 
            fg=self.CNN_BLACK,
            wraplength=650,
            justify="left",
            anchor="w"
        )
        self.reader_title_label.pack(anchor="w", pady=(0, 15), fill="x")

        # Country & Keywords
        self.reader_meta_label = tk.Label(
            content_inner, text="", 
            fg=self.CNN_MUTED, bg=self.CNN_WHITE, 
            font=self.font_small,
            anchor="w"
        )
        self.reader_meta_label.pack(anchor="w", pady=(0, 20))

        # Featured Image Container
        self.reader_img_container = tk.Frame(content_inner, bg=self.CNN_LIGHT_GRAY, height=350)
        self.reader_img_container.pack(fill="x", pady=(0, 20))
        self.reader_img_container.pack_propagate(False)
        
        self.reader_img_label = tk.Label(self.reader_img_container, bg=self.CNN_LIGHT_GRAY, text="📷 Image", fg=self.CNN_MUTED)
        self.reader_img_label.pack(expand=True)

        # Separator
        tk.Frame(content_inner, bg=self.CNN_LIGHT_GRAY, height=1).pack(fill="x", pady=(0, 20))

        # Article Body
        self.reader_content_text = tk.Text(
            content_inner, 
            font=self.font_body, 
            wrap="word", 
            height=12,
            bg=self.CNN_WHITE,
            fg=self.CNN_TEXT,
            relief="flat",
            padx=0,
            pady=0,
            spacing1=8,
            spacing2=4,
            spacing3=12,
            highlightthickness=0,
            bd=0
        )
        self.reader_content_text.pack(fill="x", pady=(0, 20))
        self.reader_content_text.config(state="disabled")

        # Source Link
        link_frame = tk.Frame(content_inner, bg=self.CNN_WHITE)
        link_frame.pack(fill="x", pady=(15, 0))
        
        tk.Label(
            link_frame, text="SOURCE:", 
            fg=self.CNN_MUTED, bg=self.CNN_WHITE, 
            font=self.font_small
        ).pack(side="left")
        
        self.reader_link_label = tk.Label(
            link_frame, text="", 
            fg="#0066cc", 
            bg=self.CNN_WHITE, 
            font=("Helvetica", 9, "underline"),
            cursor="hand2"
        )
        self.reader_link_label.pack(side="left", padx=8)
        self.reader_link_label.bind("<Button-1>", self.open_reader_link)

        # Auto-refresh when tab is selected
        self.notebook.bind("<<NotebookTabChanged>>", self.on_tab_change)

    # ═══════════════════════════════════════════════════════════════
    # SCRAPER METHODS
    # ═══════════════════════════════════════════════════════════════

    def start_scraping(self):
        self.btn_scrape.config(state="disabled", bg=self.CNN_DARK_RED)
        self.status_label.config(text="⏳ SCRAPING...", fg="#ff6600")
        self.tree.delete(*self.tree.get_children())
        
        thread = threading.Thread(target=self.run_scraper)
        thread.start()

    def run_scraper(self):
        try:
            country = self.country_var.get()
            category = self.category_var.get()
            
            countries = None if country == "All Regions" else [country]
            categories = None if category == "All Categories" else [category]
            
            self.articles = self.scraper.run_full_crawl(countries=countries, categories=categories)
            self.root.after(0, self.update_table)
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", f"Scraper failed: {e}"))
            self.root.after(0, lambda: self.btn_scrape.config(state="normal", bg=self.CNN_RED))

    def update_table(self):
        for idx, art in enumerate(self.articles):
            self.tree.insert("", "end", iid=str(idx), values=(
                art.get("country", "—")[:15],
                art.get("category", "—"),
                art.get("title", "")[:70] + "...",
                art.get("source", "Unknown")[:20],
                "PENDING"
            ))
        
        self.count_label.config(text=f"{len(self.articles)} articles")
        self.status_label.config(text="● LIVE", fg=self.CNN_RED)
        self.btn_scrape.config(state="normal", bg=self.CNN_RED)
        self.ticker_text.config(text=f"✅ Found {len(self.articles)} articles from global sources")

    def start_processing(self):
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Selection Required", "Please select an article to process!")
            return
        
        self.btn_process.config(state="disabled", bg="#555555")
        self.status_label.config(text="🤖 PROCESSING...", fg="#ff6600")
        
        thread = threading.Thread(target=self.run_processing, args=(selected[0],))
        thread.start()

    def run_processing(self, item_iid):
        try:
            article = self.articles[int(item_iid)]
            article_id = str(uuid.uuid4())
            
            full_text = self.scraper.extract_article_content(article['link'])
            if not full_text:
                full_text = article.get('description', 'No content.')
            
            detected_country = self.ai.detect_country(article['title'], full_text)
            new_title, new_content, keywords = self.ai.rewrite_cnn_style(
                article['title'], full_text, detected_country, article.get('category', 'General')
            )
            
            img_prompt = self.ai.generate_image_prompt(new_title, new_content, detected_country, article.get('category'))
            img_path = self.ai.generate_image(img_prompt, article_id)
            
            if img_path and not img_path.startswith("http"):
                img_url = self.storage.upload_image(img_path, f"news/{article_id}.png")
            else:
                img_url = img_path
            
            article_data = {
                "id": article_id,
                "country": detected_country,
                "category": article.get('category', 'General'),
                "title": new_title,
                "content": new_content,
                "keywords": keywords,
                "original_url": article['link'],
                "image_url": img_url,
                "timestamp": time.time(),
            }
            self.storage.save_article(article_data)
            
            def update_ui():
                self.tree.item(item_iid, values=(
                    detected_country[:15],
                    article.get('category', '—'),
                    new_title[:70] + "...",
                    article.get('source', 'Unknown')[:20],
                    "✅ DONE"
                ))
                self.status_label.config(text="● LIVE", fg=self.CNN_RED)
                self.btn_process.config(state="normal", bg=self.CNN_BLACK)
                self.ticker_text.config(text=f"✅ Published: {new_title[:60]}...")
            
            self.root.after(0, update_ui)
            
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", f"Processing failed: {e}"))
            self.root.after(0, lambda: self.btn_process.config(state="normal", bg=self.CNN_BLACK))

    # ═══════════════════════════════════════════════════════════════
    # READER METHODS
    # ═══════════════════════════════════════════════════════════════
    
    def on_tab_change(self, event):
        """Auto-refresh reader when switching to Reader tab."""
        selected_tab = event.widget.index("current")
        if selected_tab == 1:  # Reader tab
            self.refresh_reader_list()

    def refresh_reader_list(self):
        self.reader_listbox.delete(0, tk.END)
        
        selected_country = self.reader_country_var.get()
        
        try:
            if selected_country == "All Regions":
                article_ids = self.redis_client.smembers(f"{self.prefix}all_articles")
            else:
                country_key = f"{self.prefix}country:{selected_country.lower().replace(' ', '_')}"
                article_ids = self.redis_client.smembers(country_key)
            
            self.reader_article_ids = sorted(list(article_ids), reverse=True)
            
            for aid in self.reader_article_ids:
                data = self.redis_client.get(f"{self.prefix}article:{aid}")
                if data:
                    article = json.loads(data)
                    country = article.get("country", "")[:3].upper()
                    title = article.get("title", article.get("paraphrased_title", "Untitled"))[:50]
                    
                    display = f"[{country}] {title}..."
                    self.reader_listbox.insert(tk.END, display)
            
            count = self.reader_listbox.size()
            self.ticker_text.config(text=f"📰 {count} articles in database")
        except Exception as e:
            self.ticker_text.config(text=f"⚠️ Redis connection error: {str(e)[:40]}")

    def on_reader_select(self, event):
        selection = self.reader_listbox.curselection()
        if not selection:
            return
        
        try:
            article_id = self.reader_article_ids[selection[0]]
            raw_data = self.redis_client.get(f"{self.prefix}article:{article_id}")
            
            if raw_data:
                data = json.loads(raw_data)
                self.display_reader_article(data)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load article: {e}")

    def display_reader_article(self, data):
        # Category
        category = data.get("category", "NEWS")
        self.reader_category_label.config(text=category.upper())
        
        # Title
        title = data.get("title", data.get("paraphrased_title", "No Title"))
        self.reader_title_var.set(title)
        
        # Meta (Country + Keywords)
        country = data.get("country", "Global")
        keywords = data.get("keywords", "")
        meta_text = f"📍 {country}"
        if keywords:
            meta_text += f"  •  🏷️ {keywords}"
        self.reader_meta_label.config(text=meta_text)
        
        # Content
        content = data.get("content", "No content available.")
        self.reader_content_text.config(state="normal")
        self.reader_content_text.delete("1.0", tk.END)
        self.reader_content_text.insert(tk.END, content)
        self.reader_content_text.config(state="disabled")

        # Link
        self.full_url = data.get("original_url", "")
        if self.full_url:
            display_url = self.full_url[:55] + "..." if len(self.full_url) > 55 else self.full_url
            self.reader_link_label.config(text=display_url)
        else:
            self.reader_link_label.config(text="No source available")

        # Image
        img_url = data.get("image_url", "")
        if img_url:
            self.reader_img_label.config(text="⏳ Loading image...", image="")
            threading.Thread(target=self.load_reader_image, args=(img_url,), daemon=True).start()
        else:
            self.reader_img_label.config(image="", text="📷 No image available", fg=self.CNN_MUTED)

    def load_reader_image(self, url):
        try:
            if url.startswith("http"):
                response = requests.get(url, timeout=15)
                img_data = response.content
            else:
                if os.path.exists(url):
                    with open(url, "rb") as f:
                        img_data = f.read()
                else:
                    return
            
            img = Image.open(BytesIO(img_data))
            
            # Resize maintaining aspect ratio
            max_width = 680
            max_height = 340
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            photo = ImageTk.PhotoImage(img)
            
            def update_image():
                self.reader_img_label.config(image=photo, text="")
                self.reader_img_label.image = photo
                self.current_image = photo
            
            self.root.after(0, update_image)
        except Exception as e:
            def show_error():
                self.reader_img_label.config(image="", text=f"❌ Image failed to load", fg=self.CNN_RED)
            self.root.after(0, show_error)

    def open_reader_link(self, event):
        if self.full_url:
            webbrowser.open(self.full_url)


if __name__ == "__main__":
    root = tk.Tk()
    app = HomesPhDashboard(root)
    root.mainloop()
