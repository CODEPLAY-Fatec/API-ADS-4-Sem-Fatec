"use client";
import axios from "axios";
import {User} from "@shared/User";
import React, {useState} from 'react'



const RegisterFrom: React.FC = () => {
    const[formData,setFormData] = useState<User>({
        name: '',
        email: '',
        phoneNumber:'',
        password:'',
    });
    const [Loading,setLoading] = useState(false)

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const{name,value} = e.target;
        setFormData((prevData: User) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit =  async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try{
            await axios.post('/api/users',formData);
            //fazer para redirecionar para login se criar usuario
        }catch(error){
            console.error('Error ao cadastrar o usuario',error);

        }finally{
            setLoading(false)//encerrar o carregamento
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                password: '',
            })
        }
    };

    return(
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="Email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ border: 'solid black',borderRadius: '4px' }}

                    />
                </div>

                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ border: 'solid black',borderRadius: '4px' }}

                    />
                </div>

                <div>
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ border: 'solid black',borderRadius: '4px' }}

                    />
                </div>

                <div>
                    <label htmlFor="phoneNumber">Numero de telefone:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        style={{ border: 'solid black',borderRadius: '4px' }}

                    />
                </div>

                <button type="submit" disabled={Loading}>
                {Loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>

            </form>
        </div>
    );

};

export default RegisterFrom;