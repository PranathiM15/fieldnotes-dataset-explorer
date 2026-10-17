# Fieldnotes — Dataset Explorer

A responsive, local-first CSV exploration web app paired with a Pandas terminal script. Created for a beginner AI/ML dataset exploration task.

## Features
- Upload a CSV in your browser (the file is processed locally; there is no backend).
- Inspect row/column dimensions, detected column types, filled and missing values.
- View the first five and last five records (`head(5)` / `tail(5)`).
- See descriptive statistics for the first numeric column.
- Run a full Pandas exploration report in the terminal, including `shape`, `columns`, `info()`, `describe()`, `head()`, `tail()`, missing values, and five observations.
- Sample CSV included so you can test the project immediately.

## Part A — Run the web application
No Node.js, server, Jupyter Notebook, or database is required.

1. Extract the ZIP file.
2. Open the `dataset-explorer-webapp` folder.
3. Double-click `index.html`, or open it in your browser.
4. Click **Try sample data**, or choose your own `.csv` file.

If your browser restricts local files, use a simple local server from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Stop the server with `Ctrl+C`.

## Part B — Run the Pandas exploration in terminal

Check Python:

```bash
python --version
```

If `python` is not recognized on Windows, try `py --version` and replace `python` with `py` in the commands below.

Create and activate a virtual environment (recommended):

**Windows PowerShell**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python explore_dataset.py sample_dataset.csv
```

**Windows Command Prompt**
```bat
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python explore_dataset.py sample_dataset.csv
```

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python explore_dataset.py sample_dataset.csv
```

Explore your own CSV by placing it in this folder and running:

```bash
python explore_dataset.py your_file.csv
```

The script prints the requested report in the terminal. No notebook is used.

## Suggested observations for your submission
Use the output from your chosen dataset to write at least five truthful observations. For example: dataset dimensions; numerical vs categorical columns; columns with missing values; the range of a numerical feature; and a pattern you notice in the first/last records. The included sample is a small illustrative subset, not the full Iris dataset.

## GitHub upload
1. Sign in to GitHub and create a new empty repository at https://github.com/new.
2. Repository name suggestion: `fieldnotes-dataset-explorer`.
3. Choose **Public** if your task reviewer needs to access it. Do not initialize it with a README, license, or `.gitignore` because this folder already contains those files.
4. Open a terminal **inside the extracted `dataset-explorer-webapp` folder** and run the commands in the task instructions/chat response.

## Project structure
```text
dataset-explorer-webapp/
├── index.html
├── styles.css
├── app.js
├── explore_dataset.py
├── sample_dataset.csv
├── requirements.txt
├── README.md
└── .gitignore
```
