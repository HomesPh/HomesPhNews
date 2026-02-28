# 📅 Scheduler & Cron Job Configuration

This guide explains how to manage the global news scraper schedule and toggle modes (Test vs. Production).

---

## ⚙️ Configuration Modes

### 1️⃣ **Test Mode (Cost Saving)**
- **Purpose**: Development, testing prompts, debugging.
- **Behavior**: Scrapes **1 random country** only per run.
- **Cost**: Low API usage.

### 2️⃣ **Production Mode (Full Deployment)**
- **Purpose**: Live operations.
- **Behavior**: Scrapes **ALL 8 countries** in parallel.
- **Cost**: Higher API usage (8x calls).

---

## 🛠️ How to Switch Modes

To switch between Test and Production, verify the code blocks in **`Script/cron_job.py`** and **`Script/scheduler.py`**.

### For Test Mode (Current Default):
Ensure the code looks like this:
```python
# countries = list(COUNTRIES.keys())

# ⚠️ COST SAVING MODE: Process only 1 random country ⚠️
selected_country = random.choice(list(COUNTRIES.keys()))
countries = [selected_country]
```

### For Production Mode:
Uncomment the first line and comment out the rest:
```python
countries = list(COUNTRIES.keys())

# ⚠️ COST SAVING MODE: Process only 1 random country ⚠️
# selected_country = random.choice(list(COUNTRIES.keys()))
# countries = [selected_country]
```

---

## 🚀 Running the Scheduler

### **Option A: Manual Trigger (Once)**
Good for testing immediately.
```bash
python Script/cron_job.py
```

### **Option B: Continuous Schedule (Every Hour)**
Runs indefinitely until stopped.
```bash
python Script/scheduler.py
```
*(Or use `python Script/cron_job.py --schedule`)*

---

## 📊 Monitoring

- **Logs**: Check the terminal output for `✅ Success` or `❌ Error`.
- **GUI**: Run `python Script/main_gui.py` to see processed articles in real-time.
- **Stats**: The job prints a `JOB SUMMARY` after every run.

