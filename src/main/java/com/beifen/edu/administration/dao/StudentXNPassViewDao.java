package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.StudentXNPassViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface StudentXNPassViewDao extends JpaRepository<StudentXNPassViewPO, Long>, JpaSpecificationExecutor<StudentXNPassViewPO> {


}

