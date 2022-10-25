import React from "react";
import { Button } from "antd";

const buttonStyle = {"marginLeft": "5px"}
const wrapperStyle = {"margin": "10px"}
const ExampleQueriesPanel = ({setQueryValues}) => {

    const rs10735079 = {
        "referenceName": "12",
        "start": "112942202",
        "end": "112942202",
        "referenceBases": "G"
    }

    const rs1712779 = {
        "referenceName": "11",
        "start": "114726431",
        "end": "114726431",
        "referenceBases": "A"
    }

    const rs10831496 = {
        "referenceName": "11",
        "start": "88824822",
        "end": "88824822",
        "referenceBases": "A"
    }

    const rs12252 = {
        "referenceName": "11",
        "start": "320771",
        "end": "320771",
        "referenceBases": "A"
    }

    const rs35803318 = {
        "referenceName": "X",
        "start": "15564085",
        "end": "15564085",
        "referenceBases": "C"
    }

    const rs4344 = { 
        "referenceName": "17",
        "start": "63489362",
        "end": "63489362",
        "referenceBases": "G"
    }

    const rs2074192 = {
        "referenceName": "X",
        "start": "15564666",
        "end": "15564666",
        "referenceBases": "C"
    }

    const rs4767027 = {
      "referenceName": "12",
      "start": "112921351",
      "end": "112921351",
      "referenceBases": "T"
    }

    const allMales = {
        filters: [
          { id: 'subject.sex', operator: '=', value: 'MALE' },
        ],
      };

    const allFemales = {
    filters: [
        { id: 'subject.sex', operator: '=', value: 'FEMALE' },
    ],
    };

    const covidMales = {
      filters: [
        { id: 'subject.sex', operator: '=', value: 'MALE' },
        { id: 'diseases.[item].term.label', operator: '=', value: 'COVID-19' },
      ],
    };

    const covidFemalesWithFever = {
      filters: [
        { id: 'subject.sex', operator: '=', value: 'FEMALE' },
        { id: 'diseases.[item].term.label', operator: '=', value: 'COVID-19' },
        { id: 'phenotypic_features.[item].type.label', operator: '=', value: 'Fever' },
      ],
    };

    const anosmia = {
        filters: [
          { id: 'phenotypic_features.[item].type.label', operator: '=', value: 'Loss of sense of smell' },
        ],
      };

    const cough = {
      filters: [{ id: 'phenotypic_features.[item].type.label', operator: '=', value: 'Cough' }],
    };

    const fever = {
        filters: [{ id: 'phenotypic_features.[item].type.label', operator: '=', value: 'Fever' }],
      };


    return <>
    <div style={{display: "flex", alignItems: "center", ...wrapperStyle}}><i>Variants: </i>
        <div style={wrapperStyle}>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs4344)}><i>ACE </i>&nbsp;Intron Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs2074192)}><i>ACE2 </i>&nbsp;Intron Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs35803318)}><i>ACE2 </i>&nbsp;Synonymous Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs10831496)}><i>GRM5 </i>&nbsp;Intron Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs12252)}><i>IFITM3 </i>&nbsp;Synonymous Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs1712779)}><i>NXPE2 </i>&nbsp;Intron Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs4767027)}><i>OAS1</i>&nbsp;Intron Variant</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(rs10735079)}><i>OAS3</i>&nbsp;Intron Variant</Button>
        </div>
    </div>
    <div style={{display: "flex", alignItems: "center", ...wrapperStyle}}><i>Filters: </i>
        <div style={wrapperStyle}>
            <Button style={buttonStyle} onClick={() => setQueryValues(allMales)}>All Males</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(allFemales)}>All Females</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(covidMales)}>All Males with Covid-19</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(covidFemalesWithFever)}>All Females with Covid-19 and Fever</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(anosmia)}>Anosmia</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(cough)}>Cough</Button>
            <Button style={buttonStyle} onClick={() => setQueryValues(fever)}>Fever</Button>


        </div>
    </div>
    </>
}


export default ExampleQueriesPanel;