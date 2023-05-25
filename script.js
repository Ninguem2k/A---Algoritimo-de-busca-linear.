var nodes = [
    { id: 23, label: "Unaí", adjacencias: ["Garapuava"], color: "white" },
    { id: 22, label: "Garapuava", adjacencias: ["Unaí", "Uruana"], color: "white" },
    { id: 21, label: "Uruana", adjacencias: ["Garapuava", "Arinos"], color: "white" },

    {
        id: 1,
        label: "Arinos",
        adjacencias: ["Urucuia", "Uruana", "Riachinho", "Chapada Gaúcha"],
        color: "green",
    },

    { id: 20, label: "Bonfinópolis", adjacencias: ["Riachinho"], color: "white" },
    {
        id: 19,
        label: "Riachinho",
        adjacencias: ["Bonfinópolis", "Arinos"],
        color: "white",
    },
    {
        id: 3,
        label: "Chapada Gaúcha",
        adjacencias: ["Serra das Araras", "Arinos"],
        color: "white",
    },
    {
        id: 4,
        label: "Serra das Araras",
        adjacencias: ["São Joaquim", "Chapada Gaúcha"],
        color: "white",
    },
    {
        id: 5,
        label: "São Joaquim",
        adjacencias: ["Pandeiros", "Serra das Araras"],
        color: "white",
    },
    { id: 6, label: "Pandeiros", adjacencias: ["Tejuco", "São Joaquim"], color: "white" },
    { id: 7, label: "Tejuco", adjacencias: ["Januaria", "Pandeiros"], color: "white" },
    {
        id: 8,
        label: "Urucuia",
        adjacencias: ["Arinos", "São Romão", "Pintopolis"],
        color: "white",
    },
    {
        id: 9,
        label: "Pintopolis",
        adjacencias: ["Urucuia", "São Francisco"],
        color: "white",
    },
    {
        id: 10,
        label: "São Francisco",
        adjacencias: ["Pintopolis", "Travessão de Minas"],
        color: "white",
    },
    {
        id: 11,
        label: "Travessão de Minas",
        adjacencias: ["São Francisco", "Pedras de Maria da Cruz"],
        color: "white",
    },
    {
        id: 12,
        label: "Pedras de Maria da Cruz",
        adjacencias: ["Travessão de Minas", "Januaria", "Lontra"],
        color: "white",
    },
    { id: 13, label: "São Romão", adjacencias: ["Ubai", "Urucuia"], color: "white" },
    {
        id: 14,
        label: "Ubai",
        adjacencias: ["São Romão", "Brasilia de minas"],
        color: "white",
    },
    {
        id: 15,
        label: "Brasilia de minas",
        adjacencias: ["Ubai", "Santa Fé de Minas"],
        color: "white",
    },
    {
        id: 16,
        label: "Santa Fé de Minas",
        adjacencias: ["Japonvar", "Brasilia de minas"],
        color: "white",
    },
    {
        id: 17,
        label: "Japonvar",
        adjacencias: ["Lontra", "Santa Fé de Minas"],
        color: "white",
    },
    {
        id: 18,
        label: "Lontra",
        adjacencias: ["Japonvar", "Pedras de Maria da Cruz"],
        color: "white",
    },

    {
        id: 2,
        label: "Januaria",
        adjacencias: ["Itacarambi", "Morro Itapiraçaba", "Pedras de Maria da Cruz", "Tejuco"],
        color: "red",
    },
    { id: 24, label: "Morro Itapiraçaba", adjacencias: ["Januaria"], color: "white" },
    { id: 25, label: "Itacarambi", adjacencias: ["Januaria"], color: "white" },
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
    .attr("class", "node")
    .attr("data-id", function (d) {
        return d.id;
    });

node.append("circle").attr("r", 10);

node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", -15)
    .text(function (d) {
        // return d.id;
        return d.id + " - " + d.label;
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

function buscaEmProfundidade(grafo, inicio, objetivo) {
    const pilha = [];

    pilha.push([inicio, [inicio]]);

    while (pilha.length > 0) {
        const [no, caminho] = pilha.pop();
        visitados.add(no);
        console.log(no);
        if (no === objetivo) {
            return caminho;
        }

        const vizinhos = grafo[no];

        vizinhos.forEach(vizinho => {
            if (!visitados.has(vizinho)) {
                pilha.push([vizinho, [...caminho, vizinho]]);
            }
        });
    }
    return null;
}

const inicio = "Arinos";
const objetivo = "Januaria";

const caminho = buscaEmProfundidade(grafo, inicio, objetivo);


if (caminho) {
    console.log(`Caminho encontrado: ${caminho}`);
    drawn(caminho, true);
} else {
    drawn(caminho, false);
    console.log("Não há caminho entre os nós.");
}


function drawn(caminho, res) {
    var arrayNode = document.getElementsByClassName("node");
    var array = Array.from(visitados);

    function loop(index, array) {
        if (index >= array.length) {
            if (res) {
                drawnCaminho(caminho);
                return;
            } else {
                toPath(caminho, false);
                return;
            }
        }

        const element = array[index];
        var sourceNode = nodes.find(function (node) {
            return node.label === element;
        });

        if (sourceNode.id > 2) {
            for (let index = 0; index < arrayNode.length; index++) {
                if (arrayNode[index].getAttribute("data-id") == sourceNode.id) {
                    arrayNode[index].style.fill = "yellow";
                }
            }
        }
        setTimeout(function () {
            loop(index + 1, array, nodes);
        }, 500);
    }

    loop(0, array);
}

function drawnCaminho(caminho) {
    var arrayNode = document.getElementsByClassName("node");
    function loop(index, array) {
        if (index >= array.length) {
            toPath(caminho, true);
            return;
        }

        const element = array[index];
        var sourceNode = nodes.find(function (node) {
            return node.label === element;
        });

        if (sourceNode.id > 2) {
            for (let index = 0; index < arrayNode.length; index++) {
                if (arrayNode[index].getAttribute("data-id") == sourceNode.id) {
                    arrayNode[index].style.fill = "blue";
                }
            }
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

function toPath(caminho, res) {
    var cityCard = document.getElementById("city-card");


    if (res) {
        cityCard.textContent = "";
        caminho.forEach(function (city) {
            var cityName = document.createElement("li");
            cityName.textContent = city;
            cityCard.appendChild(cityName);
        });
    } else {
        cityCard.textContent = "Não existe conecção até o Objetivo";
    }

}


