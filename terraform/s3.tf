resource "aws_s3_bucket" "dev" {
  bucket = "lih-pdf-render-dev"
  acl = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }

  tags = {
    Name = "PDF Render for Development"
    Environment = "development"
    Project = local.project
  }
}
