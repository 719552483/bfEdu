package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.CourseCheckOnPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CourseCheckOnDao extends JpaRepository<CourseCheckOnPO, String>, JpaSpecificationExecutor<CourseCheckOnPO> {
}
