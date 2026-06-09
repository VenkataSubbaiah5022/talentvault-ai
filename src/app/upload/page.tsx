import { PageHeader } from "@/components/layout/page-header";
import { UploadZone } from "@/components/upload/upload-zone";

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload resumes"
        description="Add candidates to your vault. Files are stored securely; PII is scrubbed before any AI processing."
      />
      <UploadZone />
    </div>
  );
}
