export default function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                <small>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</small>
            </div>
        </footer>
    );
}
