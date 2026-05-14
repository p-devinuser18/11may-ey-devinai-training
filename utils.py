import os
from datetime import datetime


def get_project_root() -> str:
    return os.path.dirname(os.path.abspath(__file__))


def get_timestamp() -> str:
    return datetime.now().isoformat()


def read_file(filepath: str) -> str:
    with open(filepath, "r") as f:
        return f.read()
