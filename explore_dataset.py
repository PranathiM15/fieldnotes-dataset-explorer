#!/usr/bin/env python3
"""Explore a CSV dataset from the terminal using Pandas (no notebook required)."""
import argparse
from pathlib import Path
import sys

try:
    import pandas as pd
except ImportError:
    print("Pandas is not installed. Run: python -m pip install -r requirements.txt", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    parser = argparse.ArgumentParser(description="Explore a CSV dataset using Pandas.")
    parser.add_argument("csv_file", nargs="?", default="sample_dataset.csv", help="Path to a CSV file (default: sample_dataset.csv)")
    args = parser.parse_args()
    path = Path(args.csv_file)
    if not path.is_file():
        print(f"Error: file not found: {path}", file=sys.stderr)
        return 2
    try:
        df = pd.read_csv(path)
    except Exception as exc:
        print(f"Error reading CSV: {exc}", file=sys.stderr)
        return 2

    print("\n" + "=" * 68)
    print(f"DATASET EXPLORATION: {path.name}")
    print("=" * 68)
    print("\n[1] DIMENSIONS (DataFrame.shape)")
    print(f"Rows: {df.shape[0]} | Columns: {df.shape[1]} | Shape: {df.shape}")
    print("\n[2] COLUMN NAMES")
    for i, column in enumerate(df.columns, start=1):
        print(f"{i:>2}. {column}")
    print("\n[3] INFO (DataFrame.info)")
    df.info()
    print("\n[4] DESCRIPTIVE STATISTICS (DataFrame.describe, include='all')")
    print(df.describe(include="all").to_string())
    print("\n[5] FIRST FIVE ROWS (DataFrame.head)")
    print(df.head().to_string(index=False))
    print("\n[6] LAST FIVE ROWS (DataFrame.tail)")
    print(df.tail().to_string(index=False))
    print("\n[7] MISSING VALUES BY COLUMN")
    print(df.isna().sum().to_string())
    print("\n[8] COLUMN CATEGORIES")
    numeric = df.select_dtypes(include="number").columns.tolist()
    categorical = df.select_dtypes(exclude="number").columns.tolist()
    print(f"Numerical ({len(numeric)}): {numeric}")
    print(f"Categorical / other ({len(categorical)}): {categorical}")
    print("\n[9] FIVE OBSERVATIONS")
    observations = [
        f"The dataset contains {df.shape[0]} rows and {df.shape[1]} columns.",
        f"There are {len(numeric)} numerical column(s) and {len(categorical)} categorical/other column(s).",
        f"The dataset contains {int(df.isna().sum().sum())} missing cell(s).",
        f"Column names are: {', '.join(map(str, df.columns))}.",
        f"The first five records are shown above; use head(n) to inspect a different number of records.",
    ]
    for i, note in enumerate(observations, start=1):
        print(f"{i}. {note}")
    print("\nExploration complete. No notebook required.\n")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
