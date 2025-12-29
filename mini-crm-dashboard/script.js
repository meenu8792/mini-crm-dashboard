document.addEventListener("DOMContentLoaded", () => {

let role = "admin";
let chart;

let leads = [
  { company:"Acme Corp", status:"New", deal:1100 },
  { company:"Betasoloin", status:"New", deal:251 },
  { company:"Bluth Co", status:"Won", deal:1242 },
  { company:"Cheers", status:"Won", deal:4269 },
  { company:"Condax", status:"Lost", deal:4 },
  { company:"Conecom", status:"New", deal:1520 },
  { company:"Dambase", status:"Won", deal:2173 },
  { company:"Doncon", status:"New", deal:587 },
  { company:"Donquadtech", status:"Won", deal:1712 },
  { company:"Dontechi", status:"Won", deal:4618 }
];

const table = document.getElementById("leadsTable");
const chartCanvas = document.getElementById("chartCanvas");
const chartsMenu = document.getElementById("chartsMenu");

function renderTable() {
  table.innerHTML = "";
  leads.forEach((l,i)=>{
    table.innerHTML += `
      <tr>
        <td>${l.company}</td>
        <td>
          ${role==="admin"
            ? `<select onchange="updateStatus(${i},this.value)">
                <option ${l.status==="New"?"selected":""}>New</option>
                <option ${l.status==="Won"?"selected":""}>Won</option>
                <option ${l.status==="Lost"?"selected":""}>Lost</option>
              </select>`
            : l.status}
        </td>
        <td>$${l.deal}</td>
      </tr>
    `;
  });

  totalLeads.textContent = leads.length;
  wonLeads.textContent = leads.filter(l=>l.status==="Won").length;
  revenue.textContent =
    "$" + leads.filter(l=>l.status==="Won").reduce((s,l)=>s+l.deal,0);
}

window.updateStatus = (i,v)=>{
  leads[i].status = v;
  renderTable();
};

window.toggleChartsMenu = ()=>{
  chartsMenu.classList.toggle("hidden");
};

window.openCharts = (type)=>{
  chartsMenu.classList.add();
  showSection("charts");

  if(chart) chart.destroy();

  const labels = leads.map(l=>l.company);
  const values = leads.map(l=>l.deal);

  let config = {
    type: type==="area"?"line":type==="dot"?"scatter":type,
    data:{
      labels,
      datasets:[{
        data:values,
        fill:type==="area",
        backgroundColor:["#2563eb","#22c55e","#ef4444","#f59e0b"]
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        zoom:{
          zoom:{ wheel:{enabled:true}, pinch:{enabled:true}, mode:"xy" }
        }
      }
    }
  };

  if(type==="scatter" || type==="dot"){
    config.data = {
      datasets:[{ data: values.map((v,i)=>({x:i,y:v})) }]
    };
  }

  if(type==="bubble"){
    config.data = {
      datasets:[{ data: values.map((v,i)=>({x:i,y:v,r:8})) }]
    };
  }

  chart = new Chart(chartCanvas, config);
};

window.showSection = (id)=>{
  document.querySelectorAll(".section")
    .forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

document.getElementById("roleSelect").onchange = e=>{
  role = e.target.value;
  renderTable();
};

document.getElementById("themeToggle").onclick = ()=>{
  document.body.classList.toggle("dark");
};

renderTable();

});
