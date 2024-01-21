import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createPortal } from "react-dom";
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

interface AddParamModal {
  isOpen: boolean;
  closeModal: ()=> void;
  addNewParam: (name: string, type: string)=> void;
}

const newInputsState = (inputs: ParamValue[], id: number, value: string): ParamValue[] =>  {
  const newValue = { paramId: id, value }
  const index = inputs.findIndex((input: ParamValue)=> input.paramId === id)
  const cloneInputs = [...inputs]
  cloneInputs.splice(index, 1, newValue)
  return cloneInputs
}

const createData = (data: Props, id: number, name: string, type: string): Props=> {
  const { model: { paramValues }, params } = data
  const newData: Props = {
    model: {
      paramValues: [
        ...paramValues,
        { paramId: id, value: '' }
      ]
    },
    params: [
      ...params,
      { id: id, name, type  }
    ]
  }
  return newData
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

const ParamEditor = ({ params, model }: Props)=> {
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

const AddParamModal = ({ isOpen, closeModal, addNewParam }: AddParamModal) => {
  const [values, setValues] = useState({
      name: '',
      type: '',
      error: '',
  })

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>)=> {
      setValues({ ...values, [e.target.name]: e.target.value })
  }, [values])

  const addParam = useCallback(()=> {
      if (values.type === '' || values.name === '') {
          return setValues({ ...values, error: 'Заполните все поля!' })
      } 
      addNewParam(values.name, values.type)
      setValues({ error: '', name: '', type: '' })
      closeModal()
  }, [values])

  const modalStyles = {
      top: 100, 
      width: '100%', 
      maxWidth: 320,
      borderColor: '#26a69a',
      padding: '30px 20px'
  }
  
  const options = [
      { id: 1, value: '', label: 'Выберите поле', disabled: true, },
      { id: 2, value: 'text', label: 'Текст', disabled: false,  },
      { id: 3, value: 'email', label: 'Емейл', disabled: false,  },
      { id: 4, value: 'tel', label: 'Телефон', disabled: false,  },
      { id: 5, value: 'time', label: 'Время', disabled: false,  },
      { id: 6, value: 'date', label: 'Дата', disabled: false,  },
      { id: 7, value: 'number', label: 'Номер', disabled: false,  },
      { id: 8, value: 'range', label: 'Range', disabled: false,  },
  ]
  

  return createPortal(
      <dialog open={isOpen} style={modalStyles}>
          <input 
              type="text" 
              name="name" 
              placeholder="Название параметра" 
              onChange={onChange} 
              value={values.name} 
          />
          <select name="type" style={{ display: 'block', color: !values.type ? '#ccc' : '#000'   }} onChange={onChange} value={values.type}>
              {options.map((opt)=> (
                  <option 
                      key={opt.id}
                      value={opt.value} 
                      disabled={opt.disabled}
                      style={{color: !opt.disabled ? '#000' : '#ccc'}}
                  >
                      {opt.label}
                  </option>
              ))}
          </select>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button className="btn" onClick={closeModal}>Отмена</button>
              <button className="btn" onClick={addParam}>Добавить</button>
          </div>
          {values.error && <div style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{values.error}</div>}
      </dialog>, 
      document.body    
  )
}

const App = ()=> {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<Props | null>(null)

  useEffect(()=> {
    fetch('./data.json').then(res => res.json())
      .then(data => setData(data))
  }, [setData])

  const addNewParam = (name: string, type: string)=> {
      const id = new Date().getTime()
      if (data) {
        setData(createData(data, id, name, type))
      }
  }

  if (!data) return <div>Loading...</div>
  
  return (
    <div style={{ margin: '100px auto', maxWidth: '320px' }}>
      <ParamEditor 
        model={data.model} 
        params={data.params}
      />
      <button className="btn" onClick={()=> setIsOpen(true)}>Добавить параметр</button>
      <AddParamModal 
        isOpen={isOpen} 
        closeModal={()=> setIsOpen(false)} 
        addNewParam={addNewParam}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
