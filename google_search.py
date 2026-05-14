import sys
from googlesearch import search
import requests
from bs4 import BeautifulSoup


def fetch_page_snippet(url: str, max_length: int = 500) -> str:
    try:
        response = requests.get(url, timeout=10, headers={
            "User-Agent": "Mozilla/5.0 (compatible; QueryBot/1.0)"
        })
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)
        return text[:max_length] + "..." if len(text) > max_length else text
    except Exception:
        return "(Could not fetch page content)"


def search_google(query: str, num_results: int = 5) -> list[dict]:
    results = []
    for url in search(query, num_results=num_results):
        snippet = fetch_page_snippet(url)
        results.append({"url": url, "snippet": snippet})
    return results


def display_results(query: str, results: list[dict]) -> None:
    print(f"\nSearch results for: '{query}'\n")
    print("=" * 60)
    for i, result in enumerate(results, 1):
        print(f"\nResult {i}:")
        print(f"  URL: {result['url']}")
        print(f"  Summary: {result['snippet']}")
        print("-" * 60)


def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = input("Enter your query: ").strip()

    if not query:
        print("No query provided. Exiting.")
        return

    print(f"Searching Google for: '{query}'...")
    results = search_google(query)

    if results:
        display_results(query, results)
    else:
        print("No results found.")


if __name__ == "__main__":
    main()
