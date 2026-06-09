import { UploadZone } from "@/components/upload/upload-zone";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload resumes</h1>
        <p className="mt-1 text-muted-foreground">
          Add candidates to your vault. Files are stored securely; PII is
          scrubbed before any AI processing.
        </p>
      </div>
      <UploadZone />
    </div>
  );
}
