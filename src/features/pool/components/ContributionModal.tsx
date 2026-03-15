import { useEffect, useRef, useState } from 'react';
import {
  X, Check, AlertCircle, TrendingUp, Wallet, BadgeCheck,
  Upload, FileText, ImageIcon, Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../app/providers';
import { ContributionsService, ContributionPreview } from '../../../services/contributionsService';
import { formatCurrency } from '../../../utils/currency';

type Step = 'summary' | 'proof' | 'success';

const ACCEPTED = 'application/pdf,image/jpeg,image/jpg,image/png';
const MAX_BYTES = 5 * 1024 * 1024;

export function ContributionModal() {
  const { isContributionModalOpen, setIsContributionModalOpen, currentUser } = useApp();

  const [step, setStep]               = useState<Step>('summary');
  const [preview, setPreview]         = useState<ContributionPreview | null>(null);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [loanSettled, setLoanSettled] = useState(false);

  // Proof upload state
  const [proofFile, setProofFile]     = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load payment breakdown when modal opens
  useEffect(() => {
    if (!isContributionModalOpen || !currentUser.id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPreview(null);

    ContributionsService.preview(currentUser.id)
      .then(data => { if (!cancelled) setPreview(data); })
      .catch(e => { if (!cancelled) setError(e.message ?? 'Could not load payment details'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isContributionModalOpen, currentUser.id]);

  // Revoke object URL when file changes or modal closes
  useEffect(() => {
    return () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); };
  }, [imagePreviewUrl]);

  const handleClose = () => {
    setIsContributionModalOpen(false);
    setTimeout(() => {
      setStep('summary');
      setPreview(null);
      setError(null);
      setLoanSettled(false);
      setProofFile(null);
      setImagePreviewUrl(null);
    }, 300);
  };

  const handleFileSelect = (file: File) => {
    const type = file.type.toLowerCase();
    if (!['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(type)) {
      setError('Unsupported file type. Please upload a PDF, JPG, or PNG.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 5 MB.');
      return;
    }
    setError(null);
    setProofFile(file);
    if (type.startsWith('image/')) {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!currentUser.id || !preview) return;

    if (!proofFile) {
      setError('Please attach proof of payment before submitting your contribution.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await ContributionsService.addWithProof(
        currentUser.id,
        new Date().toISOString().slice(0, 10),
        undefined,
        proofFile,
      );
      setLoanSettled(preview.repaymentAmount > 0);
      setStep('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  const hasLoan = (preview?.activeLoanId ?? null) !== null;

  return (
    <AnimatePresence>
      {isContributionModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full lg:max-w-md lg:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between lg:rounded-t-3xl">
              <div>
                <h2 className="text-xl font-semibold">Monthly Contribution</h2>
                {step === 'proof' && (
                  <p className="text-xs text-muted-foreground mt-0.5">Step 2 of 2 — Proof of Payment</p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">

              {/* ── Loading ── */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                  <p className="text-sm text-muted-foreground">Calculating your payment…</p>
                </div>
              )}

              {/* ── Error ── */}
              {!loading && error && step !== 'success' && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* ── Step 1: Payment Summary ── */}
              {!loading && preview && step === 'summary' && (
                <>
                  {preview.hasContributedThisMonth && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">
                        A contribution for this month has already been recorded. Contact an admin if you believe this is an error.
                      </p>
                    </div>
                  )}

                  {hasLoan && (
                    <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <p className="text-sm text-warning-foreground">
                        You have an active loan. Your payment will automatically include loan repayment.
                      </p>
                    </div>
                  )}

                  <div className="bg-secondary rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-4 h-4 text-accent" />
                      <p className="text-sm font-semibold text-foreground">Monthly Contribution</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shares owned</span>
                      <span className="font-semibold tabular-nums">{Number(preview.shareUnits).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per share</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(preview.sharePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Contribution amount</span>
                      <span className="text-lg font-bold tabular-nums text-foreground">
                        {formatCurrency(preview.contributionAmount)}
                      </span>
                    </div>
                  </div>

                  {hasLoan && (
                    <div className="bg-secondary rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-warning" />
                        <p className="text-sm font-semibold text-foreground">Active Loan</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Outstanding balance</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(preview.loanOutstanding)}</span>
                      </div>
                      {preview.loanInterest > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Interest</span>
                          <span className="font-semibold tabular-nums">{formatCurrency(preview.loanInterest)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border text-sm">
                        <span className="text-muted-foreground">Repayment amount</span>
                        <span className="font-semibold tabular-nums text-warning">
                          {formatCurrency(preview.repaymentAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Total Payment Due</p>
                      <p className="text-2xl font-bold tabular-nums text-accent">
                        {formatCurrency(preview.totalDue)}
                      </p>
                    </div>
                    {hasLoan && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Includes {formatCurrency(preview.contributionAmount)} contribution
                        + {formatCurrency(preview.repaymentAmount)} loan repayment
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ── Step 2: Proof Upload ── */}
              {!loading && step === 'proof' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Upload your proof of payment so an administrator can verify your contribution.
                    This step is required before you can submit your payment.
                  </p>

                  {/* Drop zone */}
                  {!proofFile ? (
                    <div
                      onDrop={handleFileDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to upload or drag & drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — max 5 MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED}
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileSelect(f);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-secondary rounded-2xl p-4">
                      {/* Image preview */}
                      {imagePreviewUrl ? (
                        <img
                          src={imagePreviewUrl}
                          alt="Proof preview"
                          className="w-full max-h-48 object-cover rounded-xl mb-3"
                        />
                      ) : (
                        <div className="flex items-center gap-3 mb-3 bg-background rounded-xl p-3">
                          <FileText className="w-8 h-8 text-accent flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{proofFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              PDF · {(proofFile.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {imagePreviewUrl
                            ? <ImageIcon className="w-4 h-4 text-chart-2" />
                            : <FileText className="w-4 h-4 text-chart-2" />
                          }
                          <span className="text-sm font-medium text-chart-2">Proof uploaded</span>
                        </div>
                        <button
                          onClick={() => {
                            setProofFile(null);
                            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                            setImagePreviewUrl(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Step 3: Success ── */}
              {step === 'success' && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Payment Submitted!</h3>
                    <p className="text-muted-foreground text-sm">
                      Your {formatCurrency(preview?.totalDue ?? 0)} payment has been recorded.
                    </p>
                    {proofFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Proof uploaded — pending admin verification.
                      </p>
                    )}
                  </div>

                  {loanSettled && (
                    <div className="bg-chart-2/10 border border-chart-2/20 rounded-2xl p-4 flex items-start gap-3 text-left">
                      <BadgeCheck className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" />
                      <p className="text-sm text-chart-2 font-medium">Your loan has been fully settled.</p>
                    </div>
                  )}

                  <div className="bg-secondary rounded-2xl p-5 space-y-3 text-sm text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contribution</span>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(preview?.contributionAmount ?? 0)}
                      </span>
                    </div>
                    {(preview?.repaymentAmount ?? 0) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Loan repayment</span>
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(preview?.repaymentAmount ?? 0)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">Total paid</span>
                      <span className="text-lg font-bold tabular-nums">
                        {formatCurrency(preview?.totalDue ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-card p-6 border-t border-border lg:rounded-b-3xl space-y-2">
              {step === 'success' && (
                <button
                  onClick={handleClose}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
                >
                  Done
                </button>
              )}

              {step === 'summary' && !loading && preview && (
                <button
                  onClick={() => { setError(null); setStep('proof'); }}
                  disabled={!!error || preview.hasContributedThisMonth}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next — Add Proof of Payment
                </button>
              )}

              {step === 'proof' && (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !proofFile}
                    className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {submitting
                      ? 'Submitting…'
                      : proofFile
                        ? `Confirm Payment — ${formatCurrency(preview?.totalDue ?? 0)}`
                        : 'Attach proof to continue'
                    }
                  </button>
                  <button
                    onClick={() => setStep('summary')}
                    disabled={submitting}
                    className="w-full py-3 rounded-2xl text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
