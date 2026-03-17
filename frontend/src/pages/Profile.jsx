import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [preview, setPreview] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);

    useEffect(() => {
        if (user) reset({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    }, [user, reset]);

    const onSubmit = async (data) => {
        setMessage(''); setError('');
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        if (data.profilePicture?.[0]) formData.append('profilePicture', data.profilePicture[0]);
        if (removePhoto) formData.append('removeProfilePicture', 'true');
        try {
            await api.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            await refreshUser();
            toast.success('Profile updated successfully!');
            setPreview(null);
            setRemovePhoto(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update failed');
        }
    };

    const currentPhoto = removePhoto ? null : (preview || (user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : null));

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="mb-4">Edit Profile</h4>
                           
                            <div className="text-center mb-4">
                                {currentPhoto
                                    ? <img src={currentPhoto} alt="Profile" className="rounded-circle mb-2" width="90" height="90" style={{objectFit:'cover'}} />
                                    : <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-2" style={{width:90,height:90,fontSize:32}}>{user?.first_name?.[0]}</div>
                                }
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label">First Name</label>
                                        <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            {...register('first_name', { required: 'Required' })} />
                                        <div className="invalid-feedback">{errors.first_name?.message}</div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Last Name</label>
                                        <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            {...register('last_name', { required: 'Required' })} />
                                        <div className="invalid-feedback">{errors.last_name?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Email</label>
                                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                                        <div className="invalid-feedback">{errors.email?.message}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Profile Picture</label>
                                        <input type="file" accept="image/*" className="form-control"
                                            {...register('profilePicture')}
                                            onChange={e => { setRemovePhoto(false); const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
                                    </div>
                                    {(user?.profilePicture && !removePhoto) && (
                                        <div className="col-12">
                                            <button type="button" className="btn btn-outline-danger btn-sm"
                                                onClick={() => { setRemovePhoto(true); setPreview(null); }}>
                                                Remove Profile Picture
                                            </button>
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
