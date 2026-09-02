import React, { useEffect, useState } from 'react';
import { uploadPolicy, getPolicies, togglePolicy, deletePolicy } from '../service/policy.api';

const PolicyUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState('');

    const loadPolicies = async () => {
        const data = await getPolicies();
        setPolicies(data.policies);
    };

    useEffect(() => { loadPolicies(); }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            await uploadPolicy(file);
            setFile(null);
            await loadPolicies();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1>Recovery Policies</h1>

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button disabled={!file || uploading} onClick={handleUpload}>
                {uploading ? 'Uploading & Indexing...' : 'Upload Policy PDF'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {policies.map((p) => (
                    <li key={p._id}>
                        {p.filename} — v{p.version} — {p.chunkCount} chunks —{' '}
                        {p.active ? 'Active' : 'Inactive'}
                        <button onClick={async () => { await togglePolicy(p._id); loadPolicies(); }}>
                            {p.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={async () => { await deletePolicy(p._id); loadPolicies(); }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PolicyUpload;