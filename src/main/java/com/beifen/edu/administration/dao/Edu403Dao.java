package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu403;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


@Configuration
public interface Edu403Dao extends JpaRepository<Edu403, Long>, JpaSpecificationExecutor<Edu403> {


}
