package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu204;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface Edu204Dao extends JpaRepository<Edu204, Long>, JpaSpecificationExecutor<Edu204> {
}
