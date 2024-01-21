import { ChangeEvent, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface Modal {
    isOpen: boolean;
    closeModal: ()=> void;
    addNewParam: (name: string, type: string)=> void;
}

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

export const AddParamModal = ({ isOpen, closeModal, addNewParam }: Modal) => {
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