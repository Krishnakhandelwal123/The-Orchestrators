import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../lib/Axios';
import { Loader2, Upload, FileText, GraduationCap, Award, Github, CheckCircle2, X } from 'lucide-react';
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

  const FileUploadField = ({ label, icon, accept, value, onChange, required, description }) => {
    const fileInputRef = React.useRef(null);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <label className="block text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
          {icon}
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer rounded-xl border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-sm p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            required={required}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          
          {value ? (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{value.name}</p>
                <p className="text-xs text-neutral-400">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-neutral-300 mb-1">Click to upload</p>
              <p className="text-xs text-neutral-400">{description}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const uploadFields = [
    {
      label: 'Resume',
      icon: <FileText size={18} className="text-blue-400" />,
      accept: '.pdf,image/*',
      value: resume,
      onChange: setResume,
      required: true,
      description: 'PDF or Image file (PNG, JPG, JPEG)'
    },
    {
      label: 'Transcript',
      icon: <GraduationCap size={18} className="text-purple-400" />,
      accept: '.pdf,image/*',
      value: transcript,
      onChange: setTranscript,
      required: true,
      description: 'PDF or Image file (PNG, JPG, JPEG)'
    },
    {
      label: 'Certificate',
      icon: <Award size={18} className="text-indigo-400" />,
      accept: '.pdf,image/*',
      value: certificate,
      onChange: setCertificate,
      required: true,
      description: 'PDF or Image file (PNG, JPG, JPEG)'
    },
  ];

  const allFilesUploaded = resume && transcript && certificate && githubUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto text-white"
    >
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Upload Your Documents
          </h3>
          <p className="text-sm text-neutral-400">
            Provide your academic and professional documents to begin AI-powered analysis
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* File Upload Fields */}
          {uploadFields.map((field, index) => (
            <FileUploadField key={index} {...field} />
          ))}

          {/* GitHub URL Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
              <Github size={18} className="text-pink-400" />
              <span>GitHub Profile URL</span>
              <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Github size={18} />
              </div>
              <input
                type="url"
                required
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm text-white placeholder-neutral-500 focus:border-blue-500/50 focus:bg-black/30 focus:outline-none transition-all"
              />
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              {githubUrl ? (
                <>
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-green-400">Valid GitHub URL</span>
                </>
              ) : (
                <span>Enter your GitHub profile or repository URL</span>
              )}
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-300">Upload Progress</span>
              <span className="text-sm font-semibold text-blue-400">
                {[resume, transcript, certificate, githubUrl].filter(Boolean).length}/4
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${([resume, transcript, certificate, githubUrl].filter(Boolean).length / 4) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting || !allFilesUploaded}
            whileHover={!submitting && allFilesUploaded ? { scale: 1.02 } : {}}
            whileTap={!submitting && allFilesUploaded ? { scale: 0.98 } : {}}
            className="group relative w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 disabled:from-neutral-700 disabled:via-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed overflow-hidden transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:shadow-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
            <span className="relative flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Documents...</span>
                </>
              ) : (
                <>
                  <span>Start AI Analysis</span>
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </>
              )}
            </span>
          </motion.button>

          {/* Helper Text */}
          <p className="text-xs text-center text-neutral-500 pt-2">
            All documents are securely processed and analyzed by our AI system
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default OnboardingForm;


