resource "aws_iam_user" "app-pdf-render-dev" {
  name = "app-pdf-render-dev"

  tags = {
    Project     = local.project
    Environment = "development"
  }
}

# Allow access to dev bucket
resource "aws_iam_policy" "s3-pdf-render-dev-usage" {
  name        = "S3PDFRenderDevUsage"
  path        = "/"
  description = "Allow dev app access to dev bucket"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BucketPermissions",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    },
    {
      "Sid": "ObjectPermissions",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:GetObjectVersion",
        "s3:GetObjectVersionAcl",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:PutObjectVersionAcl"
      ],
      "Resource": [
        "arn:aws:s3:::${aws_s3_bucket.dev.bucket}",
        "arn:aws:s3:::${aws_s3_bucket.dev.bucket}/*"
      ]
    }
  ]
}
EOF
}
resource "aws_iam_user_policy_attachment" "s3-pdf-render-dev-usage" {
  user       = aws_iam_user.app-pdf-render-dev.name
  policy_arn = aws_iam_policy.s3-pdf-render-dev-usage.arn
}
