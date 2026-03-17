import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="mb-3">Welcome, {user?.first_name} {user?.last_name}! 👋</h3>
                            <hr />
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="bg-light rounded p-3">
                                        <small className="text-muted d-block">Full Name</small>
                                        <strong>{user?.first_name} {user?.last_name}</strong>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-light rounded p-3">
                                        <small className="text-muted d-block">Email</small>
                                        <strong>{user?.email}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
