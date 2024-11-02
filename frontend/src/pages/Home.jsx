import React from 'react';
import { Link } from 'react-router-dom';
import { FaShare, FaQrcode, FaMobileAlt, FaGlobe, FaEdit} from 'react-icons/fa';


const Home = () => (
  <div className="min-vh-100 bg-gradient-primary">
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">Contact Manager</span>
        <div className="ms-auto">
          <Link to="/login" className="btn rounded-pill btn-outline-primary me-2">Login</Link>
          <Link to="/register" className="btn rounded-pill btn-primary">Register</Link>
        </div>
      </div>
    </nav>

    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-4">Share Your Contact Info with Style</h1>
          <p className="lead mb-4">Create your digital business card in seconds. Share it instantly with anyone through a unique URL or just a tap with NFC.</p>
          <Link to="/register" className="btn rounded-pill btn-primary btn-lg mb-5">Create Your Digital Card</Link>
          
          <div className="row g-4 mt-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaGlobe className="text-primary h3 mb-0 me-3" />
                <div>
                  <h5 className="mb-1">Custom URL</h5>
                  <p className="mb-0 text-muted">Share your profile with a personalized link</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaMobileAlt className="text-primary h3 mb-0 me-3" />
                <div>
                  <h5 className="mb-1">NFC Tap</h5>
                  <p className="mb-0 text-muted">One tap contact sharing with NFC</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaQrcode className="text-primary h3 mb-0 me-3" />
                <div>
                  <h5 className="mb-1">QR Code</h5>
                  <p className="mb-0 text-muted">Scan to save contacts instantly</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <FaShare className="text-primary h3 mb-0 me-3" />
                <div>
                  <h5 className="mb-1">Easy Sharing</h5>
                  <p className="mb-0 text-muted">Share across any platform</p>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="d-flex align-items-center">
                <FaEdit className="text-primary h3 mb-0 me-3" />
                <div>
                  <h5 className="mb-1">Always Editable</h5>
                  <p className="mb-0 text-muted">Update your info anytime, same URL stays active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <img 
            src="localhost_5173_ (1).png" 
            alt="Contact sharing demonstration" 
            className="card-img-top border-0 shadow-lg"
          />
        </div>
      </div>
    </div>

  </div>
);

export default Home;