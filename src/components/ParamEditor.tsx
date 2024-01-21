import { ChangeEvent, useCallback, useEffect, useState } from "react";

export interface Param {
    id: number;
    name: string;
    type: string;
}

export interface ParamValue {
    paramId: number;
    value: string; 
}

export interface Model {
    paramValues: ParamValue[];
    // colors: null;
}

export interface Props {
    params: Param[];
    model: Model;
}

interface ParamItem {
    param: Param;
    onChange: (e: ChangeEvent<HTMLInputElement>)=> void;
    value: string;
}


const newInputsState = (inputs: ParamValue[], id: number, value: string): ParamValue[] =>  {
    const newValue = { paramId: id, value }
    const index = inputs.findIndex((input: ParamValue)=> input.paramId === id)
    const cloneInputs = [...inputs]
    cloneInputs.splice(index, 1, newValue)
    return cloneInputs
}

const ParamItem = ({ param, value, onChange }: ParamItem)=> {
    const props = { name: param.name, type: param.type, onChange, value }

    return (
        <li>
            <label>
                <span>{param.name}</span>
                <input {...props} onChange={onChange} value={value} /> 
            </label>
        </li>
    )
}

export const ParamEditor = ({ params, model }: Props)=> {
    const [inputs, setInputs] = useState<ParamValue[]>(model.paramValues)

    useEffect(()=> {
        setInputs(model.paramValues)
    }, [model, setInputs])

    const onChange = useCallback((id: number)=> {
        return (e: ChangeEvent<HTMLInputElement>)=> {
            const { value } = e.target
            setInputs(newInputsState(inputs, id, value))
        }
    }, [inputs])

    return (
        <form>
            <ul>
                {params?.map((param: Param)=> (
                    <ParamItem 
                        key={param.id} 
                        param={param} 
                        onChange={onChange(param.id)} 
                        value={inputs.find((input: ParamValue) => input.paramId === param.id)?.value || ''}
                    />
                ))}
            </ul>
        </form>
    )
}