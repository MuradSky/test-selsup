import { useEffect, useState } from 'react'
import { ParamEditor, Props } from './components/ParamEditor'
import { AddParamModal } from './components/AddParamModal'

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

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<Props | null>(null)

  useEffect(()=> {
    fetch('./data.json').then(res => res.json())
      .then(data => setData(data))
  }, [setData])

  const addNewParam = (name: string, type: string)=> {
      const time = new Date().getTime()
      if (data) {
        setData(createData(data, time, name, type))
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

export default App
