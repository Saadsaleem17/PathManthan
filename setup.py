from setuptools import setup, find_packages

setup(
    name="PathManthan",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "google-generativeai",
        "asyncio",
    ],
) 