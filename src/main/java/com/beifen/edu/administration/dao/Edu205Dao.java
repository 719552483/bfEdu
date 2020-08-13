package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu205;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface Edu205Dao extends JpaRepository<Edu205, Long>, JpaSpecificationExecutor<Edu205> {
}
