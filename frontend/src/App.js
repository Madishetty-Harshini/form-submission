import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      name,
      email,
      text,
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        fetchFeedback(); // Fetch the updated feedback list
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="heading-container mb-3">
        <h1 className="text-center text-shadow">FEEDBACK FORM</h1>
      </div>
      <div className="card p-4" style={{ width: '70%', height: isSubmitted ? 'auto' : '65%' }}>
        {isSubmitted ? (
          <div className="alert alert-success" role="alert">
            Your form has been successfully submitted!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">Name<span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control mb-3"
                id="nameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="form-text">Mandatory.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 row">
              <label htmlFor="textInput" className="col-form-label">Text<span className="text-danger">*</span></label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="textInput"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ height: '100px' }}
                  required
                />
                <div className="form-text">Mandatory.</div>
              </div>
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
        )}
      </div>
      <div className="mt-4" style={{ width: '80%' }}>
        <h2 className="text-center">Feedback Received</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((post) => (
              <tr key={post._id}>
                <td>{post.name}</td>
                <td>{post.email}</td>
                <td>{post.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
