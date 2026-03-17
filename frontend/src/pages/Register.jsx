import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/api';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await api.post('/auth/register', {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                agreeTerms: data.agreeTerms
            });
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="card-title mb-4 text-center">Create Account</h4>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label">First Name</label>
                                        <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            {...register('first_name', { required: 'First name is required' })} />
                                        <div className="invalid-feedback">{errors.first_name?.message}</div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Last Name</label>
                                        <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            {...register('last_name', { required: 'Last name is required' })} />
                                        <div className="invalid-feedback">{errors.last_name?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Email</label>
                                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                                        <div className="invalid-feedback">{errors.email?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Password</label>
                                        <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                                        <div className="invalid-feedback">{errors.password?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === watch('password') || 'Passwords do not match' })} />
                                        <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input type="checkbox" className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                                {...register('agreeTerms', { required: 'You must agree to terms' })} />
                                            <label className="form-check-label">I agree to Terms &amp; Conditions</label>
                                            <div className="invalid-feedback">{errors.agreeTerms?.message}</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary w-100">Register</button>
                                    </div>
                                </div>
                            </form>
                            <p className="text-center mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
