####### VPC #######
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.app_name}-vpc-${var.environment}"
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.public_subnet_cidrs
  public_subnets  = var.private_subnet_cidrs

  enable_nat_gateway = true
  single_nat_gateway = true
  
  enable_dns_support  = true
  enable_dns_hostnames = true

  tags = {
    Environment = var.environment
  }

  vpc_tags = {
    Name = "${var.app_name}-vpc-${var.environment}"
  }
}

###### VPN Security Group ######
resource "aws_default_security_group" "vpn-security-group" {
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ips
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "vpn-security-group",
    Environment = var.environment
  }

  depends_on = [module.vpc]
}

###### Site EC2 Security Group ######
resource "aws_security_group" "site-ec2-sec-grp" {
  name   = "${var.app_name}-frontend-sg-alb-${var.environment}"
  vpc_id = module.vpc.vpc_id
 
  ingress {
   protocol         = "tcp"
   from_port        = 80
   to_port          = 80
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  ingress {
   protocol         = "tcp"
   from_port        = 443
   to_port          = 443
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
  
  ingress {
   protocol         = "tcp"
   from_port        = 4202
   to_port          = 4202
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  egress {
   protocol         = "-1"
   from_port        = 0
   to_port          = 0
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
}

####### ALB #######
resource "aws_lb" "site-alb" {
  name               = "${var.app_name_hyphens}-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.site-ec2-sec-grp.id]
  subnets            = module.vpc.public_subnets
 
  enable_deletion_protection = true
}

####### App Server Target Group #######
resource "aws_alb_target_group" "app-server-tg" {
  name        = "${var.app_name_hyphens}-app-server-tg-${var.environment}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "instance"
 
  health_check {
   healthy_threshold   = "2"
   interval            = "15"
   protocol            = "HTTP"
   matcher             = "200"
   timeout             = "10"
   path                = "/"
   unhealthy_threshold = "3"
  }
}

resource "aws_alb_listener" "frontend-http" {
  load_balancer_arn = aws_lb.site-alb.id
  port              = 80
  protocol          = "HTTP"
 
  default_action {
  type = "redirect"
 
    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
 
resource "aws_alb_listener" "frontend-https" {
  load_balancer_arn = aws_lb.site-alb.id
  port              = 443
  protocol          = "HTTPS"
 
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.alb_tls_cert_arn
 
  default_action {
    target_group_arn = aws_alb_target_group.app-server-tg.id
    type             = "forward"
  }
}
