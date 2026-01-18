"""
HomesPh Global News Engine - CNN-Style Article Viewer (Light Theme)
Professional interface for viewing processed articles from Redis.
"""

import tkinter as tk
from tkinter import ttk
import redis
import json
import os
import webbrowser
from PIL import Image, ImageTk
import requests
from io import BytesIO
from dotenv import load_dotenv
from config import COUNTRIES
import threading

load_dotenv()

class CNNArticleViewer:
    def __init__(self, root):
        self.root = root
        self.root.title("HomesPh | Article Viewer")
        self.root.geometry("1300x850")
        self.root.configure(bg="#ffffff")
        self.root.minsize(1000, 700)

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
        self.font_headline = ("Helvetica", 24, "bold")
        self.font_subhead = ("Helvetica", 14)
        self.font_body = ("Helvetica", 12)
        self.font_caption = ("Helvetica", 9)
        self.font_category = ("Helvetica", 10, "bold")

        # Redis Setup
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.prefix = os.getenv("REDIS_PREFIX", "homesph:")

        self.current_image = None
        self.full_url = ""
        self.setup_ui()
        self.refresh_list()

    def setup_ui(self):
        # === TOP NAVIGATION (Black) ===
        nav_bar = tk.Frame(self.root, bg=self.CNN_BLACK, height=50)
        nav_bar.pack(fill="x")
        nav_bar.pack_propagate(False)

        # Logo (Red Box)
        logo_frame = tk.Frame(nav_bar, bg=self.CNN_RED, padx=18, pady=10)
        logo_frame.pack(side="left")
        tk.Label(
            logo_frame, text="HOMESPH", 
            fg=self.CNN_WHITE, bg=self.CNN_RED, 
            font=self.font_brand
        ).pack()

        # Navigation Links
        nav_items = ["Headlines", "World", "Business", "Real Estate", "Technology"]
        nav_frame = tk.Frame(nav_bar, bg=self.CNN_BLACK)
        nav_frame.pack(side="left", padx=30)
        
        for item in nav_items:
            lbl = tk.Label(
                nav_frame, text=item, 
                fg="#888888", bg=self.CNN_BLACK,
                font=("Helvetica", 10),
                padx=15,
                cursor="hand2"
            )
            lbl.pack(side="left")
            lbl.bind("<Enter>", lambda e, l=lbl: l.config(fg=self.CNN_WHITE))
            lbl.bind("<Leave>", lambda e, l=lbl: l.config(fg="#888888"))

        # Reader Badge
        tk.Label(
            nav_bar, text="📰 READER", 
            fg=self.CNN_RED, bg=self.CNN_BLACK,
            font=self.font_category
        ).pack(side="right", padx=20)

        # === MAIN CONTENT ===
        main_pane = tk.PanedWindow(
            self.root, orient="horizontal", 
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
            filter_header, text="LATEST STORIES", 
            fg=self.CNN_BLACK, bg=self.CNN_GRAY,
            font=self.font_category
        ).pack(side="left")

        btn_refresh = tk.Button(
            filter_header, text="↻ Refresh", 
            command=self.refresh_list,
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
            font=self.font_caption
        ).pack(anchor="w")
        
        self.country_var = tk.StringVar(value="All Regions")
        country_options = ["All Regions"] + list(COUNTRIES.keys())
        self.country_menu = ttk.Combobox(
            filter_row, 
            textvariable=self.country_var, 
            values=country_options, 
            width=30,
            font=self.font_body
        )
        self.country_menu.pack(fill="x", pady=5)
        self.country_menu.bind("<<ComboboxSelected>>", lambda e: self.refresh_list())

        # Separator
        tk.Frame(left_panel, bg=self.CNN_LIGHT_GRAY, height=1).pack(fill="x")

        # Article List
        list_frame = tk.Frame(left_panel, bg=self.CNN_WHITE, padx=10, pady=10)
        list_frame.pack(fill="both", expand=True)
        
        self.listbox = tk.Listbox(
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
        self.listbox.pack(fill="both", expand=True, side="left")
        self.listbox.bind("<<ListboxSelect>>", self.on_select)

        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.listbox.yview)
        self.listbox.configure(yscroll=scrollbar.set)
        scrollbar.pack(side="right", fill="y")

        # === RIGHT PANEL: ARTICLE CONTENT ===
        right_panel = tk.Frame(main_pane, bg=self.CNN_WHITE)
        main_pane.add(right_panel, minsize=600)

        # Scrollable Content
        canvas = tk.Canvas(right_panel, bg=self.CNN_WHITE, highlightthickness=0)
        scrollbar_right = ttk.Scrollbar(right_panel, orient="vertical", command=canvas.yview)
        self.content_frame = tk.Frame(canvas, bg=self.CNN_WHITE)

        self.content_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=self.content_frame, anchor="nw", width=720)
        canvas.configure(yscrollcommand=scrollbar_right.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar_right.pack(side="right", fill="y")

        # Article Content Elements
        content_inner = tk.Frame(self.content_frame, bg=self.CNN_WHITE, padx=35, pady=25)
        content_inner.pack(fill="both", expand=True)

        # Category Badge
        self.category_label = tk.Label(
            content_inner, text="NEWS", 
            fg=self.CNN_WHITE, bg=self.CNN_RED,
            font=self.font_category,
            padx=12, pady=5
        )
        self.category_label.pack(anchor="w", pady=(0, 18))

        # Headline
        self.title_var = tk.StringVar(value="Select an article to read")
        self.title_label = tk.Label(
            content_inner, 
            textvariable=self.title_var, 
            font=self.font_headline, 
            bg=self.CNN_WHITE, 
            fg=self.CNN_BLACK,
            wraplength=650,
            justify="left",
            anchor="w"
        )
        self.title_label.pack(anchor="w", pady=(0, 15), fill="x")

        # Country & Keywords
        self.meta_label = tk.Label(
            content_inner, text="", 
            fg=self.CNN_MUTED, bg=self.CNN_WHITE, 
            font=self.font_caption,
            anchor="w"
        )
        self.meta_label.pack(anchor="w", pady=(0, 20))

        # Featured Image Container
        self.img_container = tk.Frame(content_inner, bg=self.CNN_LIGHT_GRAY, height=380)
        self.img_container.pack(fill="x", pady=(0, 20))
        self.img_container.pack_propagate(False)
        
        self.img_label = tk.Label(self.img_container, bg=self.CNN_LIGHT_GRAY, text="📷 Image", fg=self.CNN_MUTED)
        self.img_label.pack(expand=True)

        # Separator
        tk.Frame(content_inner, bg=self.CNN_LIGHT_GRAY, height=1).pack(fill="x", pady=(0, 20))

        # Article Body
        self.content_text = tk.Text(
            content_inner, 
            font=self.font_body, 
            wrap="word", 
            height=14,
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
        self.content_text.pack(fill="x", pady=(0, 20))
        self.content_text.config(state="disabled")

        # Source Link
        link_frame = tk.Frame(content_inner, bg=self.CNN_WHITE)
        link_frame.pack(fill="x", pady=(15, 0))
        
        tk.Label(
            link_frame, text="SOURCE:", 
            fg=self.CNN_MUTED, bg=self.CNN_WHITE, 
            font=self.font_caption
        ).pack(side="left")
        
        self.link_label = tk.Label(
            link_frame, text="", 
            fg="#0066cc", 
            bg=self.CNN_WHITE, 
            font=("Helvetica", 9, "underline"),
            cursor="hand2"
        )
        self.link_label.pack(side="left", padx=8)
        self.link_label.bind("<Button-1>", self.open_link)

        # === FOOTER ===
        footer = tk.Frame(self.root, bg=self.CNN_GRAY, height=40)
        footer.pack(fill="x")
        footer.pack_propagate(False)
        
        tk.Label(
            footer, 
            text="© 2026 HomesPh Global News Engine — Powered by Gemini AI", 
            fg=self.CNN_MUTED, bg=self.CNN_GRAY,
            font=self.font_caption
        ).pack(pady=12)

    def refresh_list(self):
        self.listbox.delete(0, tk.END)
        
        selected_country = self.country_var.get()
        
        if selected_country == "All Regions":
            article_ids = self.redis_client.smembers(f"{self.prefix}all_articles")
        else:
            country_key = f"{self.prefix}country:{selected_country.lower().replace(' ', '_')}"
            article_ids = self.redis_client.smembers(country_key)
        
        count = 0
        for aid in sorted(article_ids, reverse=True):
            data = self.redis_client.get(f"{self.prefix}article:{aid}")
            if data:
                article = json.loads(data)
                country = article.get("country", "")[:3].upper()
                title = article.get("title", article.get("paraphrased_title", "Untitled"))[:50]
                
                display = f"[{country}] {title}..."
                self.listbox.insert(tk.END, display)
                count += 1
        
        self.root.title(f"HomesPh Reader | {count} Articles")

    def on_select(self, event):
        selection = self.listbox.curselection()
        if not selection:
            return
        
        selected_country = self.country_var.get()
        
        if selected_country == "All Regions":
            article_ids = list(self.redis_client.smembers(f"{self.prefix}all_articles"))
        else:
            country_key = f"{self.prefix}country:{selected_country.lower().replace(' ', '_')}"
            article_ids = list(self.redis_client.smembers(country_key))
        
        article_ids = sorted(article_ids, reverse=True)
        if selection[0] < len(article_ids):
            article_id = article_ids[selection[0]]
            raw_data = self.redis_client.get(f"{self.prefix}article:{article_id}")
            
            if raw_data:
                data = json.loads(raw_data)
                self.display_article(data)

    def display_article(self, data):
        # Category
        category = data.get("category", "NEWS")
        self.category_label.config(text=category.upper())
        
        # Title
        title = data.get("title", data.get("paraphrased_title", "No Title"))
        self.title_var.set(title)
        
        # Meta (Country + Keywords)
        country = data.get("country", "Global")
        keywords = data.get("keywords", "")
        meta_text = f"📍 {country}"
        if keywords:
            meta_text += f"  •  🏷️ {keywords}"
        self.meta_label.config(text=meta_text)
        
        # Content
        content = data.get("content", "No content available.")
        self.content_text.config(state="normal")
        self.content_text.delete("1.0", tk.END)
        self.content_text.insert(tk.END, content)
        self.content_text.config(state="disabled")

        # Link
        self.full_url = data.get("original_url", "")
        if self.full_url:
            display_url = self.full_url[:55] + "..." if len(self.full_url) > 55 else self.full_url
            self.link_label.config(text=display_url)
        else:
            self.link_label.config(text="No source available")

        # Image
        img_url = data.get("image_url", "")
        if img_url:
            self.img_label.config(text="⏳ Loading image...", image="")
            threading.Thread(target=self.load_image, args=(img_url,), daemon=True).start()
        else:
            self.img_label.config(image="", text="📷 No image available", fg=self.CNN_MUTED)

    def load_image(self, url):
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
            max_height = 370
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            photo = ImageTk.PhotoImage(img)
            
            def update_image():
                self.img_label.config(image=photo, text="")
                self.img_label.image = photo
                self.current_image = photo
            
            self.root.after(0, update_image)
        except Exception as e:
            def show_error():
                self.img_label.config(image="", text=f"❌ Image failed to load", fg=self.CNN_RED)
            self.root.after(0, show_error)

    def open_link(self, event):
        if self.full_url:
            webbrowser.open(self.full_url)

if __name__ == "__main__":
    root = tk.Tk()
    app = CNNArticleViewer(root)
    root.mainloop()
