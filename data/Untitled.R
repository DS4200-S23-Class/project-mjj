enrollment <- read_csv("Enrollment.csv", na = c("-3", "-5", "-6", "-8", "-9", 
                                                "-11"))
yearly_pubs_gender2 <- pivot_wider(yearly_pubs_gender, names_from = gender, 
                                   values_from = author_counts, values_fill=0)