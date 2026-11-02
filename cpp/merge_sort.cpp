#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeSort(vector<int> v) {
  if (v.size() <= 1) return v;
  int mid = v.size() / 2;
  vector<int> A = mergeSort(vector<int>(v.begin(), v.begin() + mid));
  vector<int> B = mergeSort(vector<int>(v.begin() + mid, v.end()));
  vector<int> result;
  int i = 0, j = 0;
  while (i < A.size() && j < B.size()) {
    if (A[i] <= B[j]) result.push_back(A[i++]);
    else result.push_back(B[j++]);
  }
  while (i < A.size()) result.push_back(A[i++]);
  while (j < B.size()) result.push_back(B[j++]);
  return result;
}

int main() {
  vector<int> v = {5, 2, 8, 1, 9, 3, 7, 4};
  v = mergeSort(v);
  for (int x : v) cout << x << ' ';
  cout << '\n';
  return 0;
}
