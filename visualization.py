import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

import numpy as np

class visualizer:
  def __init__(self, array):
    self.array = array
    self.fig, self.ax = plt.subplots()

    self.bar_rects = self.ax.bar(range(len(self.array)), self.array, align="edge")

    self.ax.set_xlim(0, len(self.array))
    self.ax.set_ylim(0, int(1.1 * max(self.array)))
    self.ax.set_aspect('equal')

    self.ax.axis('off')
    plt.grid(False)

    plt.title('Sorting Algorithm Visualizer')
    plt.show()


if __name__ == "__main__":
  # array = np.random.randint(1, 100, 50)
  array = [1, 2, 3, 4, 5]
  visualizer = visualizer(array)
  visualizer.visualization()
