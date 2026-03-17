import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

export default function ChangePassword() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
            await api.post('/users/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            toast.success('Password changed');
            reset();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to change password');        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="mb-4">Change Password</h4>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input type="password" className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                        {...register('currentPassword', { required: 'Current password is required' })} />
                                    <div className="invalid-feedback">{errors.currentPassword?.message}</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                        {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                                    <div className="invalid-feedback">{errors.newPassword?.message}</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === watch('newPassword') || 'Passwords do not match' })} />
                                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Change Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
