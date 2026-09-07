import { actionPlanMarkdown, auditScore, maturityLabel, priorityActions, sectionScores } from "./src/core.js";

const STORAGE_KEY="process-proof-audit-v2";
const LEGACY_STORAGE_KEY="process-proof-audit-v1";
const sampleItems=[
  {id:"owner",section:"Ownership",label:"A single process owner is accountable",detail:"The owner can approve changes and resolve exceptions.",status:"yes",weight:3},
  {id:"backup",section:"Ownership",label:"A trained backup owner is named",detail:"The process does not stop when one person is unavailable.",status:"partial",weight:2},
  {id:"roles",section:"Ownership",label:"Roles and handoffs are explicit",detail:"Every step has a clear doer, reviewer, and recipient.",status:"yes",weight:2},
  {id:"steps",section:"Documentation",label:"Steps are written in execution order",detail:"A new team member can follow the process without tribal knowledge.",status:"partial",weight:3},
  {id:"version",section:"Documentation",label:"The SOP has a version and review date",detail:"People can distinguish the current process from an outdated copy.",status:"no",weight:2},
  {id:"inputs",section:"Documentation",label:"Required inputs and outputs are defined",detail:"Templates, systems, and deliverables are linked or named.",status:"partial",weight:2},
  {id:"approval",section:"Controls",label:"High-risk actions require approval",detail:"Financial, data, or customer-impacting decisions have a checkpoint.",status:"yes",weight:3},
  {id:"exceptions",section:"Controls",label:"Exceptions are logged and escalated",detail:"The team knows what to do when the normal path fails.",status:"no",weight:3},
  {id:"access",section:"Controls",label:"System access follows least privilege",detail:"Permissions match the work required and are periodically reviewed.",status:"partial",weight:3},
  {id:"sla",section:"Measurement",label:"A service level or cycle-time target exists",detail:"The process has a measurable expectation for speed.",status:"yes",weight:2},
  {id:"quality",section:"Measurement",label:"Quality or error rate is monitored",detail:"The team can see whether speed is creating rework.",status:"partial",weight:3},
  {id:"review",section:"Measurement",label:"Performance is reviewed on a cadence",detail:"Results trigger owners, actions, and due dates.",status:"no",weight:2},
];
function defaultContext(){return {processName:"",processOwner:"",reviewDate:new Date().toISOString().slice(0,10)}}
let {items,context}=load();
function load(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved&&Array.isArray(saved.items))return {items:saved.items,context:{...defaultContext(),...(saved.context||{})}};
    const legacy=JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if(Array.isArray(legacy))return {items:legacy,context:defaultContext()};
  }catch{}
  return {items:structuredClone(sampleItems),context:defaultContext()};
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({items,context}))}
function escapeHtml(value){const node=document.createElement("span");node.textContent=value;return node.innerHTML}

function render(){
  document.querySelector("#processName").value=context.processName;
  document.querySelector("#processOwner").value=context.processOwner;
  document.querySelector("#reviewDate").value=context.reviewDate;
  const score=auditScore(items);document.querySelector("#auditScore").textContent=score;document.querySelector("#maturityLabel").textContent=maturityLabel(score);
  document.querySelector("#sectionSummary").innerHTML=sectionScores(items).map((section)=>`<article><strong>${section.score}%</strong><span>${escapeHtml(section.section)} · ${section.completed}/${section.total} established</span></article>`).join("");
  const sections=Object.groupBy(items,(item)=>item.section);
  document.querySelector("#checklist").innerHTML=Object.entries(sections).map(([section,sectionItems])=>`<div class="section-block"><h3>${escapeHtml(section)}</h3>${sectionItems.map((item)=>`<div class="audit-row"><div><p>${escapeHtml(item.label)}</p><small>${escapeHtml(item.detail)}</small></div><select data-id="${item.id}" aria-label="Status for ${escapeHtml(item.label)}"><option value="unanswered" ${item.status==="unanswered"?"selected":""}>Not reviewed</option><option value="yes" ${item.status==="yes"?"selected":""}>Yes</option><option value="partial" ${item.status==="partial"?"selected":""}>Partial</option><option value="no" ${item.status==="no"?"selected":""}>No</option></select></div>`).join("")}</div>`).join("");
  const actions=priorityActions(items);
  document.querySelector("#actions").innerHTML=actions.length?actions.map((item)=>`<li><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.section)} · ${item.status==="partial"?"Strengthen current practice":"Create a control"}</span></li>`).join(""):`<li class="empty">No open actions. Schedule the next review.</li>`;
}

document.querySelector("#auditContext").addEventListener("input",(event)=>{const field=event.target.dataset.contextField;if(!field)return;context={...context,[field]:event.target.value};save()});
document.querySelector("#checklist").addEventListener("change",(event)=>{const id=event.target.dataset.id;if(!id)return;items=items.map((item)=>item.id===id?{...item,status:event.target.value}:item);save();render()});
document.querySelector("#resetButton").addEventListener("click",()=>{items=structuredClone(sampleItems);context=defaultContext();save();render()});
document.querySelector("#exportButton").addEventListener("click",()=>{const text=actionPlanMarkdown(items,context);const link=document.createElement("a");link.href=URL.createObjectURL(new Blob([text],{type:"text/markdown"}));link.download="sop-audit-action-plan.md";link.click();URL.revokeObjectURL(link.href)});
render();
