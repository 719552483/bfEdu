package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu112;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface Edu112Dao extends JpaRepository<Edu112, Long>, JpaSpecificationExecutor<Edu112> {
}
