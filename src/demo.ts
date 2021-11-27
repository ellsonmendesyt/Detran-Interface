

interface Veiculo{
    nome:string;
    placa:string;
    entrada:Date | string;
}

(function(){

//  atalho pro query
const $ = (query:string):HTMLInputElement | null => document.querySelector(query);



 function calcularTempo(mil:number){

   const min = Math.floor(mil/6000);
   const sec = Math.floor((mil %6000) / 1000);


    return `${min}m ${sec}s`;
 }



function patio(){
    function ler():Veiculo[]{
        return localStorage.patio  ? JSON.parse(localStorage.patio) : [];
    }
    
    function salvar(veiculos: Veiculo[]){
        localStorage.setItem("patio", JSON.stringify(veiculos));

    }
    
    function adicionar(veiculo:Veiculo, add?:boolean){
        
        const row = document.createElement("tr");
        row.innerHTML=`
        <td>${veiculo.nome} </td>
        <td>${veiculo.placa} </td>
        <td>${veiculo.entrada} </td>
        <td> <button class="delete" data-placa="${veiculo.placa}"> <i class="fa fa-credit-card-alt" aria-hidden="true"></i> </button> </td>
        `;

        row.querySelector(".delete")?.addEventListener("click", function(){
            remover(this.dataset.placa)
        })

        $("#patio")?.appendChild(row);
        if(add)salvar([...ler(),veiculo]);
        $("#nome").value="";
        $("#placa").value="";

    }


    function remover(placa:string){
       const {entrada,nome} =ler().find(veiculo=> veiculo.placa===placa);

       const tempo = calcularTempo( (new Date().getTime()) - new Date(entrada).getTime());

       if(!confirm(`O veiculo ${nome} permanceu ${tempo}, Deseja encerrar?`)) return;

       salvar(ler().filter(veiculo => veiculo.placa !== placa))
       renderizar();
    }

    function renderizar(){
        $("#patio")!.innerHTML="";
        const patio = ler();

        if(patio.length>0){
            patio.forEach(veiculo =>
                adicionar(veiculo,false)
            )
        }
    }

    return {ler, adicionar,salvar,remover,renderizar}
}




 patio().renderizar();
$("#cadastrar")?.addEventListener('click', ()=>{
    const nome = $("#nome")?.value;
const placa = $("#placa")?.value;

if(!nome || !placa ){
    alert("Digite nome e placa");
    return;
}
    patio().adicionar({nome,placa,entrada:new Date().toISOString()},true);
})


})();