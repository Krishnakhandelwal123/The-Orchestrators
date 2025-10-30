import React, { useState } from 'react';
import { axiosInstance } from '../../lib/Axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OnboardingForm = ({ onComplete }) => {
  const [resume, setResume] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !transcript || !certificate || !githubUrl) {
      toast.error('Resume, Transcript, Certificate, and GitHub URL are required');
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      if (resume) fd.append('resume', resume);
      if (transcript) fd.append('transcript', transcript);
      if (certificate) fd.append('certificate', certificate);
      if (githubUrl) fd.append('githubUrl', githubUrl);
      const res = await axiosInstance.post('/analysis/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Analysis saved');
      onComplete?.(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-white">
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-[#424242] bg-[#212121] p-6">
        <div>
          <label className="block mb-2 text-sm text-gray-300">Resume (PDF/Image)</label>
          <input type="file" accept=".pdf,image/*" required onChange={(e) => setResume(e.target.files?.[0] || null)} className="w-full" />
        </div>
        <div>
          <label className="block mb-2 text-sm text-gray-300">Transcript (PDF/Image)</label>
          <input type="file" accept=".pdf,image/*" required onChange={(e) => setTranscript(e.target.files?.[0] || null)} className="w-full" />
        </div>
        <div>
          <label className="block mb-2 text-sm text-gray-300">Certificate (PDF/Image)</label>
          <input type="file" accept=".pdf,image/*" required onChange={(e) => setCertificate(e.target.files?.[0] || null)} className="w-full" />
        </div>
        <div>
          <label className="block mb-2 text-sm text-gray-300">GitHub Profile or Repo URL (optional)</label>
          <input
            type="url"
            required
            placeholder="https://github.com/username or https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-[#424242] bg-[#212121] p-3 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button type="submit" disabled={submitting} className="mt-2 cursor-pointer w-full rounded-lg bg-blue-600 py-3 font-semibold transition-colors hover:bg-blue-700 disabled:opacity-60">
          {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Processing...</span> : 'Start Analysis'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;


