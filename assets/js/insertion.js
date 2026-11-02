(function (root) {
  'use strict';

  var code = [
    'void insertionSort(vector<int>& v) {',
    '  int n = v.size();',
    '  for (int i = 1; i < n; i++) {',
    '    int key = v[i];',
    '    int j = i - 1;',
    '    while (j >= 0 && v[j] > key) {',
    '      v[j + 1] = v[j];',
    '      j--;',
    '    }',
    '    v[j + 1] = key;',
    '  }',
    '}'
  ];

  function gen(input) {
    var a = input.slice(), n = a.length, steps = [];
    var st = { n: null, i: null, key: null, j: null, hole: null, sortedEnd: 0 };

    function snap(line, note, ex) {
      steps.push(Object.assign({
        line: line, note: note, arr: a.slice(), v: Object.assign({}, st),
        hl: [], sw: [], placed: null
      }, ex || {}));
    }

    snap(1, 'Gọi insertionSort(v) với mảng [' + a.join(', ') + '].');
    st.n = n;
    snap(2, 'n = v.size() = ' + n + '. Phần đầu mảng v[0..0] (một phần tử) coi như đã sắp xếp.');

    var i = 1;
    while (true) {
      st.i = i; st.key = null; st.j = null; st.hole = null; st.sortedEnd = i - 1;
      if (i >= n) {
        snap(3, 'i = ' + i + ' = n: thoát vòng lặp, cả mảng đã sắp xếp.');
        break;
      }
      snap(3, 'i = ' + i + ': lấy phần tử tiếp theo v[' + i + '] = ' + a[i] + ' để chèn vào đoạn đã sắp xếp v[0..' + (i - 1) + '].');

      var key = a[i];
      st.key = key; st.hole = i;
      snap(4, 'key = v[' + i + '] = ' + key + ': nhấc nó ra khỏi mảng, để lại một ô trống (hole) ở vị trí ' + i + '.');

      var j = i - 1;
      st.j = j;
      snap(5, 'j = i - 1 = ' + j + ': bắt đầu so sánh với phần tử đứng ngay trước ô trống.');

      while (true) {
        var cond = j >= 0 && a[j] > key;
        var why;
        if (j < 0) why = 'j = ' + j + ' < 0: đã tới đầu mảng, dừng.';
        else if (cond) why = 'v[' + j + '] = ' + a[j] + ' > key = ' + key + ': đúng, phần tử này phải dịch sang phải.';
        else why = 'v[' + j + '] = ' + a[j] + ' <= key = ' + key + ': không lớn hơn, đã tìm được chỗ cho key. Dừng.';
        snap(6, why, { hl: j >= 0 ? [j] : [] });
        if (!cond) break;

        a[j + 1] = a[j];
        st.hole = j;
        snap(7, 'v[' + (j + 1) + '] = v[' + j + '] = ' + a[j + 1] + ': dịch sang phải một ô, ô trống lùi về vị trí ' + j + '.', { sw: [j + 1] });

        j--;
        st.j = j;
        snap(8, 'j-- → j = ' + j + '.');
      }

      a[j + 1] = key;
      st.hole = null; st.sortedEnd = i;
      snap(10, 'v[' + (j + 1) + '] = key = ' + key + ': thả key vào ô trống. Đoạn v[0..' + i + '] giờ đã sắp xếp.', { placed: j + 1 });
      i++;
    }
    snap(12, 'Xong! Mảng đã sắp xếp tăng dần: [' + a.join(', ') + '].');
    return steps;
  }

  function render(s) {
    var v = s.v;
    var doneAll = v.i != null && v.i >= v.n;
    function cls(i) {
      if (i === v.hole) return 'hole';
      if (i === s.placed) return 'swap';
      if (s.sw.indexOf(i) >= 0) return 'swap';
      if (s.hl.indexOf(i) >= 0) return 'cmp';
      if (doneAll || (i <= v.sortedEnd && (v.hole == null || i < v.hole))) return 'sorted';
      if (v.hole != null && i > v.hole && i <= v.i) return 'cur';
      return '';
    }
    function mk(i) {
      var m = [];
      if (v.i === i && !doneAll) m.push('i');
      if (v.j === i && v.hole != null) m.push('j');
      return m.join(',');
    }
    var top = v.key != null && v.hole != null
      ? '<div class="keybox">key = ' + v.key + '</div>'
      : '<div class="keybox" style="visibility:hidden">key</div>';
    return top + root.Viz.cells(s.arr, { cls: cls, mk: mk, blank: function (i) { return i === v.hole; } });
  }

  function vars(s) {
    var v = s.v, it = [];
    if (v.n != null) it.push(['n', v.n]);
    if (v.i != null) it.push(['i', v.i]);
    if (v.key != null) it.push(['key', v.key]);
    if (v.j != null) it.push(['j', v.j]);
    return [{ label: 'insertionSort', items: it }];
  }

  var api = {
    title: 'Insertion Sort',
    idea: 'Giống xếp bài trên tay: lấy từng lá bài tiếp theo (key), dịch các lá lớn hơn sang phải, rồi thả key vào chỗ trống đúng vị trí.',
    badges: [['Thời gian', 'O(n²) xấu nhất, O(n) khi gần sắp xếp'], ['Bộ nhớ', 'O(1)'], ['Ổn định', 'Có']],
    legend: [['cur', 'đang được dịch phải'], ['cmp', 'đang so sánh với key'], ['swap', 'vừa ghi giá trị'], ['sorted', 'đoạn đã sắp xếp']],
    defaultArr: [5, 2, 8, 1, 9, 3, 7, 4],
    code: code, gen: gen, render: render, vars: vars
  };
  if (typeof module !== 'undefined') module.exports = api; else root.ALGO = api;
})(typeof window !== 'undefined' ? window : globalThis);
