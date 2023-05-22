var nodes = [
    {
        id: 1,
        label: "Arinos",
        adjacencias: ["Urucuia", "Riachinho", "Uruana", "Chapada Gaúcha"],
        color: "green",
    },
    {
        id: 2,
        label: "Januaria",
        adjacencias: ["Itacarambi", "Morro Itapiraçaba"],
        color: "red",
    },
    {
        id: 3,
        label: "Chapada Gaúcha",
        adjacencias: ["Serra das Araras"],
        color: "white",
    },
    {
        id: 4,
        label: "Urucuia",
        adjacencias: ["Pintopolis", "São Romão"],
        color: "white",
    },
    {
        id: 5,
        label: "Riachinho",
        adjacencias: ["Bonfinópolis"],
        color: "white",
    },
    { id: 6, label: "Uruana", adjacencias: ["Garapuava"], color: "white" },
    {
        id: 7,
        label: "Serra das Araras",
        adjacencias: ["São Joaquim"],
        color: "white",
    },
    { id: 8, label: "Pandeiros", adjacencias: [], color: "white" },
    { id: 9, label: "Tejuco", adjacencias: ["Januaria"], color: "white" },
    {
        id: 10,
        label: "São Joaquim",
        adjacencias: ["Pandeiros"],
        color: "white",
    },
    { id: 11, label: "Morro Itapiraçaba", adjacencias: [], color: "white" },
    { id: 12, label: "São Romão", adjacencias: [], color: "white" },
    { id: 13, label: "Bonfinópolis", adjacencias: [], color: "white" },
    {
        id: 14,
        label: "Pintopolis",
        adjacencias: ["São Francisco"],
        color: "white",
    },
    { id: 15, label: "Garapuava", adjacencias: ["Unaí"], color: "white" },
    { id: 16, label: "Unaí", adjacencias: [], color: "white" },
    {
        id: 17,
        label: "São Francisco",
        adjacencias: ["Travessão de Minas"],
        color: "white",
    },
    { id: 18, label: "Itacarambi", adjacencias: [], color: "white" },
    {
        id: 19,
        label: "Travessão de Minas",
        adjacencias: ["Pedras de Maria da Cruz"],
        color: "white",
    },
    {
        id: 20,
        label: "Pedras de Maria da Cruz",
        adjacencias: ["Januaria"],
        color: "white",
    },
];

var links = [];

nodes.forEach(function (node) {
    var source = node.id;
    var adjacencias = node.adjacencias;

    adjacencias.forEach(function (adjacencia) {
        var target = nodes.find(function (n) {
            return n.label === adjacencia;
        });

        if (target) {
            var targetId = target.id;
            links.push({ source: source, target: targetId });
        }
    });
});

var width = 500;
var height = 500;

var svg = d3.select("svg").attr("width", width).attr("height", height);

var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-20))
    .force(
        "link",
        d3.forceLink(links).id(function (d) {
            return d.id;
        })
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");

var node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .style("fill", function (d) {
        return d.color;
    })
    .attr("class", "node");

node.append("circle").attr("r", 10);

node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", -10)
    .text(function (d) {
        return d.id;
    });

simulation.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
});

var grafo = {};

links.forEach(function (link) {
    var source = link.source;
    var target = link.target;

    var sourceNode = nodes.find(function (node) {
        return node.id === source.id;
    });

    var targetNode = nodes.find(function (node) {
        return node.id === target.id;
    });

    var sourceLabel, targetLabel;

    if (sourceNode != undefined) {
        sourceLabel = sourceNode.label;
        targetLabel = targetNode.label;
    }

    if (!grafo[sourceLabel]) {
        grafo[sourceLabel] = [];
    }

    if (!grafo[targetLabel]) {
        grafo[targetLabel] = [];
    }

    grafo[sourceLabel].push(targetLabel);
});

console.log(grafo);
const visitados = new Set();

function buscaEmLargura(grafo, inicio, objetivo) {
    const fila = [];

    fila.push([inicio, [inicio]]);

    while (fila.length > 0) {
        const [no, caminho] = fila.shift();
        visitados.add(no);

        if (no === objetivo) {
            return caminho;
        }

        const vizinhos = grafo[no];

        vizinhos.forEach(vizinho => {
            if (!visitados.has(vizinho)) {
                fila.push([vizinho, [...caminho, vizinho]]);
            }
        });
    }
    return null;
}

const inicio = "Arinos";
const objetivo = "Januaria";

const caminho = buscaEmLargura(grafo, inicio, objetivo);

if (caminho) {
    console.log(`Caminho encontrado: ${caminho}`);
    drawn(caminho, true);
} else {
    drawn(caminho, false);
    console.log("Não há caminho entre os nós.");
}

function drawn(caminho, res) {
    var array = Array.from(visitados);

    function loop(index, array) {
        if (index >= array.length) {
            if (res) {
                drawnCaminho(caminho);
            }
            return;
        }

        const element = array[index];
        var sourceNode = nodes.find(function (node) {
            return node.label === element;
        });

        if (sourceNode.id > 2) {
            var cl = sourceNode.id + 20;
            document.querySelector(
                "body > div > center > svg > g:nth-child(" + cl + ")"
            ).style.fill = "yellow";
        }
        setTimeout(function () {
            loop(index + 1, array, nodes);
        }, 500);
    }

    loop(0, array);
}

function drawnCaminho(caminho) {
    // for (let index = 0; index < caminho.length; index++) {
    //     const element = caminho[index];
    //     var sourceNode = nodes.find(function (node) {
    //         return node.label === element;
    //     });

    //     if (sourceNode.id > 2) {
    //         var cl = sourceNode.id + 20;
    //         document.querySelector(
    //             "body > div > center > svg > g:nth-child(" + cl + ")"
    //         ).style.fill = "blue";
    //     }
    // }
    function loop(index, array) {
        if (index >= array.length) {
            return;
        }

        const element = array[index];
        var sourceNode = nodes.find(function (node) {
            return node.label === element;
        });

        if (sourceNode.id > 2) {
            var cl = sourceNode.id + 20;
            document.querySelector(
                "body > div > center > svg > g:nth-child(" + cl + ")"
            ).style.fill = "blue";
        }
        setTimeout(function () {
            loop(index + 1, array, nodes);
        }, 500);
    }
    loop(0, caminho);
}

var tableNodes = document.getElementById("legendNode");
nodes.forEach(function (objeto) {
    var linha = document.createElement("tr");

    var celulaId = document.createElement("td");
    celulaId.textContent = "#" + objeto.id + " Ponto:";
    linha.appendChild(celulaId);

    var celulaLabel = document.createElement("td");
    celulaLabel.textContent = objeto.label;
    linha.appendChild(celulaLabel);

    var celulaLabel = document.createElement("td");
    celulaLabel.textContent = objeto.adjacencias;
    linha.appendChild(celulaLabel);

    tableNodes.appendChild(linha);
});
