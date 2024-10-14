"""
This program contains the sorting algorithms that will be animated by the algorithm visualizer.
"""

class QuickSort:
    def partition(self, arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i+1], arr[high] = arr[high], arr[i+1]
        return i+1

    def quick_sort(self, arr, low, high):
        if low < high:
            pi = self.partition(arr, low, high)
            yield arr
            yield from self.quick_sort(arr, low, pi - 1)
            yield from self.quick_sort(arr, pi + 1, high)

class BubbleSort:
    def bubble_sort(self, arr):
        n = len(arr)
        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
                    yield arr
            if not swapped:
                break

class InsertionSort:
    def insertion_sort(self, arr):
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and key < arr[j]:
                arr[j + 1] = arr[j]
                j -= 1
                yield arr
            arr[j + 1] = key
            