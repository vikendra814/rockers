import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/login', data);
            await login(res.data.token, res.data.refreshToken);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="card-title mb-4 text-center">Login</h4>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        {...register('password', { required: 'Password is required' })} />
                                    <div className="invalid-feedback">{errors.password?.message}</div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <p className="text-center mt-3 mb-0">Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
