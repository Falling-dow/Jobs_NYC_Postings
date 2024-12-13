# Exploring NYC Government Job Postings

## Introduction

In this project, we will examines the `NYC_jobs` dataset, which provides detailed information about job openings posted on the City of New York's official jobs site. 

Our main objectives include: 
- Exploring the accessibility of these jobs to the general public versus city employees.  
- Understanding the types of jobs available across different government departments. 
- Analyzing salary trends and career levels in demand. 


## Data Description

The dataset used for this analysis is titled `NYC_jobs`, sourced from NYC Open Data and provided by the Department of Citywide Administrative Services (DCAS).  

### Dataset Details: 
- **Source**: [NYC Open Data Portal](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t/about_data) 
- **Rows**: 5,560 
- **Columns**: 30 
- **Last Updated**: November 19, 2024 
- **Time Frame**: Primarily includes job postings from 2024 
- **Key Features**:  
 - **Categorical Variables**: Agency/department, job title, posting type, career level, etc  
 - **Numerical Variables**: Number of positions, salary range (minimum and maximum).  

Potential challenges with the dataset include missing or incomplete values, which are addressed during the data preprocessing stage. 

## Project Structure  
 1. **Data Preprocessing and General Distribution**:   
- Cleaning the data to address missing values and create additional columns for analysis.    
- Understanding the general distribution of categorical and numerical variables. 

 2. **Exploration of Number of Positions**:    
- Analyzing the number of job positions posted by different government agencies.    

 3. **Salary Analysis**:   
- Investigating factors influencing salaries, including career level, programming requirements, and job categories.    
- Comparing salaries across various government departments and job types.  

## Key Findings  
1. **Top Agencies by Job Postings**:    
- The Department of Environmental Protection, Bronx District Attorney, Department of Health/Mental Hygiene, and HRA/Dept of Social Services are the top four agencies with the highest number of job postings. This reflects the city’s focus on critical areas such as environmental protection, public health, and social services.  

2. **Programming Skills and Job Opportunities**:    
- A slightly higher percentage of positions require programming skills, suggesting that knowledge of programming languages can expand job options. For example, roles requiring back-end or front-end programming offer competitive salaries.  

3. **Salary Trends**:    
- Higher career levels (e.g., executive and manager roles) are associated with significantly higher median salaries.    
- Jobs in technical fields, such as Technology, Data & Innovation, offer the highest median salaries, emphasizing the value of technical skills like programming.  

4. **Guidance for Job Seekers**:   
 - Individuals with specific career goals can use our interactive visualizations to explore job availability and salary trends tailored to their desired fields and career levels.    
- Those unsure about their future career paths but seeking higher earnings should consider developing technical skills and targeting roles in technology, data, or engineering.  

## Limitations and Future Directions  
### Limitations: 
- **Geographical Scope**: The dataset is limited to NYC job postings, which may not represent broader trends in the U.S. 
- **Time Frame**: The dataset primarily focuses on postings from 2023 to 2024, limiting the ability to analyze historical trends.  

### Future Directions: 
- **Expand Data Collection**: Incorporating job postings from previous years and other states could provide a more comprehensive view of job market trends. 
- **Broaden Scope**: Adding new variables, such as job requirements and benefits, could help deepen the analysis. 

## How to Use This Project  
1. **Exploration and Visualization**:    
- Use the included R scripts to explore the dataset and replicate visualizations.    

2. **Interactive Analysis**:    
- Leverage the interactive D3 visualizations (if implemented) to customize your exploration by job category or career level

3. **Insight Generation**:   
 - Apply these findings to understand current trends in NYC’s job market and identify skills or fields that align with your career goals.
