package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu990;
@Configuration
public interface Edu000Dao extends  JpaRepository<Edu000, Long>,JpaSpecificationExecutor<Edu000>{

	
	//查询二级代码
	@Query(value = "select * from edu000 b where b.ejdmGlzd=?1", nativeQuery = true)
	public List<Edu000> queryejdm(String ejdmGlzd);
	
	@Query(value = "select * from edu000", nativeQuery = true)
	public List<Edu000> queryejdm();
}
