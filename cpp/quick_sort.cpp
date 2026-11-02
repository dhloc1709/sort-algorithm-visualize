#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& v, int low, int high) {
  int pivot = v[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (v[j] < pivot) {
      i++;
      swap(v[i], v[j]);
    }
  }
  swap(v[i + 1], v[high]);
  return i + 1;
}

void quickSort(vector<int>& v, int low, int high) {
  if (low >= high) return;
  int p = partition(v, low, high);
  quickSort(v, low, p - 1);
  quickSort(v, p + 1, high);
}

int main() {
  vector<int> v = {5, 2, 8, 1, 9, 3, 7, 4};
  quickSort(v, 0, (int)v.size() - 1);
  for (int x : v) cout << x << ' ';
  cout << '\n';
  return 0;
}
