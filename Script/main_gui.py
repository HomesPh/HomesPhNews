"""
HomesPh Global News Engine - CNN-Style Dashboard (Light Theme)
Professional news scraper interface with CNN design aesthetics.
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

class HomesPhDashboard:
    def __init__(self, root):
        self.root = root
        self.root.title("HomesPh | Global News Engine")
        self.root.geometry("1300x800")
        self.root.configure(bg="#ffffff")
        self.root.minsize(1100, 700)

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
        self.font_body = ("Helvetica", 11)
        self.font_small = ("Helvetica", 9)
        self.font_category = ("Helvetica", 10, "bold")

        # Initialize Services
        self.scraper = NewsScraper()
        self.ai = AIProcessor()
        self.storage = StorageHandler()
        
        self.articles = []
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

        # Category Navigation
        categories_frame = tk.Frame(nav_bar, bg=self.CNN_BLACK)
        categories_frame.pack(side="left", padx=30)
        
        for cat in CATEGORIES[:6]:
            btn = tk.Label(
                categories_frame, 
                text=cat, 
                fg="#999999", 
                bg=self.CNN_BLACK,
                font=self.font_small,
                cursor="hand2",
                padx=15
            )
            btn.pack(side="left")
            btn.bind("<Enter>", lambda e, b=btn: b.config(fg=self.CNN_WHITE))
            btn.bind("<Leave>", lambda e, b=btn: b.config(fg="#999999"))

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

        # === CONTROL PANEL (Light Gray) ===
        control_panel = tk.Frame(self.root, bg=self.CNN_GRAY, pady=15, padx=25)
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

        # === MAIN CONTENT AREA (White) ===
        content_area = tk.Frame(self.root, bg=self.CNN_WHITE, padx=25, pady=15)
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

        # Table Container with Border
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

if __name__ == "__main__":
    root = tk.Tk()
    app = HomesPhDashboard(root)
    root.mainloop()
