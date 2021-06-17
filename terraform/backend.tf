terraform {
  backend "remote" {
    organization = "dbl-works"

    workspaces {
      name = "pdf-render"
    }
  }
}
