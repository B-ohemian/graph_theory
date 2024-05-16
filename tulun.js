function havelHakimi(arr) {
    arr.sort((a, b) => b - a);
    let matrix = [];

    while (arr.length > 1) {
        let currentResult = [...arr];
        matrix.push(currentResult);
        let n = arr[0];
        arr.shift();
        if (n > arr.length) {
            return [matrix, false];
        }
        for (let i = 0; i < n; i++) {
            arr[i] -= 1;
            if (arr[i] < 0) {
                return [matrix, false];
            }
        }
        arr.sort((a, b) => b - a);
    }
    matrix.push([...arr]);
    return [matrix, arr[0] === 0];
}

function makeMatrixUniform(matrix) {
    // 找到二维数组中最长的数组长度
    let maxLength = 0;
    for (let row of matrix) {
        if (row.length > maxLength) {
            maxLength = row.length;
        }
    }
    // 将每个数组的长度补齐为最大长度
    for (let row of matrix) {
        while (row.length < maxLength) {
            row.push(0); // 在这里使用0作为补充数值
        }
    }

    return matrix;
}

function generateAdjacencyMatrix(degrees) {
    let n = degrees.length;
    let matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let degreeList = degrees.map((degree, i) => [degree, i]);

    while (degreeList.length) {
        degreeList.sort((a, b) => b[0] - a[0]); // 降序排序
        let [d, i] = degreeList.shift();
        if (d > degreeList.length) {
            return null;
        }
        for (let j = 0; j < d; j++) {
            degreeList[j][0]--;
            matrix[i][degreeList[j][1]] = 1;
            matrix[degreeList[j][1]][i] = 1;
        }
        degreeList = degreeList.filter(x => x[0] > 0);
    }
    return matrix;
}

// 判断是否为图序列
function isGraphSequence(sequence) {
    let result = havelHakimi(sequence.slice());
    makeMatrixUniform(result[0]);
    let resultDiv = document.getElementById('result');
    let resultText = "处理过程的矩阵：<br>";
    for (let row of result[0]) {
        resultText += row.join(' ') + "<br>";
    }

    if (result[1]) {
        resultDiv.style.color = "green"; // 设置字体颜色为红色
        resultText += "该序列是图序列！";
        let adjacencyMatrix = generateAdjacencyMatrix(sequence.slice());
        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        const nodes = adjacencyMatrix.map((d, i) => ({
            id: i,
            x: Math.cos(2 * Math.PI / adjacencyMatrix.length * i) * 200 + width / 2.5,
            y: Math.sin(2 * Math.PI / adjacencyMatrix.length * i) * 200 + height / 2.5
        }));

        const links = [];
        for (let i = 0; i < adjacencyMatrix.length; i++) {
            for (let j = i; j < adjacencyMatrix.length; j++) {
                if (adjacencyMatrix[i][j] === 1) {
                    links.push({ source: i, target: j });
                }
            }
        }

        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("class", "link")
            .attr("x1", d => nodes[d.source].x)
            .attr("y1", d => nodes[d.source].y)
            .attr("x2", d => nodes[d.target].x)
            .attr("y2", d => nodes[d.target].y);

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", 20)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("class", "label")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .text(d => d.id)
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white");
        console.log(adjacencyMatrix);
    } else {
        resultDiv.style.color = "red"; // 设置字体颜色为红色
        resultText += "该序列不是图序列！";
        clearInputs();
    }

    resultDiv.innerHTML = resultText;
}

// 将度序列矩阵转换为邻接矩阵
function graphSequenceToAdjacencyMatrix(matrix) {
    const nodeCount = matrix.length;
    const adjacencyMatrix = new Array(nodeCount).fill(0).map(() => new Array(nodeCount).fill(0));

    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            if (i !== j && matrix[i][j] > 0) {
                adjacencyMatrix[i][j] = 1;
                adjacencyMatrix[j][i] = 1;
            }
        }
    }
    return adjacencyMatrix;
}

function clearInputs() {
    document.getElementById('numberInput').value = '';
    document.getElementById('result').innerHTML = '';
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
}
