#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

void heapify(vector<int>& v, int n, int i) {
  while (true) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && v[l] > v[largest]) largest = l;
    if (r < n && v[r] > v[largest]) largest = r;
    if (largest == i) break;
    swap(v[i], v[largest]);
    i = largest;
  }
}

void heapSort(vector<int>& v) {
  int n = v.size();
  for (int i = n / 2 - 1; i >= 0; i--) {
    heapify(v, n, i);
  }
  for (int end = n - 1; end > 0; end--) {
    swap(v[0], v[end]);
    heapify(v, end, 0);
  }
}

int main() {
  vector<int> v = {4, 10, 3, 5, 1, 8, 7, 2};
  heapSort(v);
  for (int x : v) cout << x << ' ';
  cout << '\n';
  return 0;
}
