export interface Experience {
  id: string
  period: string
  role: string
  company: string
  description: string
  techStack: string[]
}

export interface Project {
  id: string
  period: string
  title: string
  description: string
  tags: string[]
  link?: string
}

export interface Profile {
  name: string
  title: string
  statement: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  iconName: string
}

export interface PortfolioData {
  about: string
  aboutKeywords: string[]
  profile: Profile
  socials: SocialLink[]
  experiences: Experience[]
  projects: Project[]
}
